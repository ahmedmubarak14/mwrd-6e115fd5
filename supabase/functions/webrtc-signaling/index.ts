import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'call-invitation' | 'call-response';
  callId: string;
  userId: string;
  targetUserId?: string;
  data?: any;
}

const connectedClients = new Map<string, WebSocket>();
const callRooms = new Map<string, Set<string>>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log("WebRTC signaling client connected");
  };

  socket.onmessage = async (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log("Received signaling message:", message.type, message.callId);

      switch (message.type) {
        case 'join-room':
          await handleJoinRoom(socket, message, supabase);
          break;
        case 'leave-room':
          await handleLeaveRoom(socket, message);
          break;
        case 'call-invitation':
          await handleCallInvitation(socket, message, supabase);
          break;
        case 'call-response':
          await handleCallResponse(socket, message, supabase);
          break;
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          await handleWebRTCSignaling(socket, message);
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error processing signaling message:", error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      }));
    }
  };

  socket.onclose = () => {
    console.log("WebRTC signaling client disconnected");
    // Clean up client connections
    for (const [userId, ws] of connectedClients.entries()) {
      if (ws === socket) {
        connectedClients.delete(userId);
        // Remove from all call rooms
        for (const [callId, participants] of callRooms.entries()) {
          participants.delete(userId);
          if (participants.size === 0) {
            callRooms.delete(callId);
          }
        }
        break;
      }
    }
  };

  return response;
});

async function handleJoinRoom(socket: WebSocket, message: SignalingMessage, supabase: any) {
  const { callId, userId } = message;
  
  // Store the client connection
  connectedClients.set(userId, socket);
  
  // Add user to call room
  if (!callRooms.has(callId)) {
    callRooms.set(callId, new Set());
  }
  callRooms.get(callId)!.add(userId);
  
  console.log(`User ${userId} joined call room ${callId}`);
  
  // Notify other participants
  const participants = callRooms.get(callId)!;
  for (const participantId of participants) {
    if (participantId !== userId) {
      const participantSocket = connectedClients.get(participantId);
      if (participantSocket) {
        participantSocket.send(JSON.stringify({
          type: 'user-joined',
          callId,
          userId,
          participants: Array.from(participants)
        }));
      }
    }
  }
  
  // Send confirmation to joining user
  socket.send(JSON.stringify({
    type: 'room-joined',
    callId,
    participants: Array.from(participants)
  }));
}

async function handleLeaveRoom(socket: WebSocket, message: SignalingMessage) {
  const { callId, userId } = message;
  
  // Remove user from call room
  const participants = callRooms.get(callId);
  if (participants) {
    participants.delete(userId);
    
    // Notify other participants
    for (const participantId of participants) {
      const participantSocket = connectedClients.get(participantId);
      if (participantSocket) {
        participantSocket.send(JSON.stringify({
          type: 'user-left',
          callId,
          userId,
          participants: Array.from(participants)
        }));
      }
    }
    
    // Clean up empty rooms
    if (participants.size === 0) {
      callRooms.delete(callId);
    }
  }
  
  console.log(`User ${userId} left call room ${callId}`);
}

async function handleCallInvitation(socket: WebSocket, message: SignalingMessage, supabase: any) {
  const { userId, targetUserId, data } = message;
  
  try {
    // Create video call record
    const { data: videoCall, error: callError } = await supabase
      .from('video_calls')
      .insert({
        caller_id: userId,
        callee_id: targetUserId,
        call_type: data.callType || 'video',
        status: 'initiated',
        conversation_id: data.conversationId
      })
      .select()
      .single();
      
    if (callError) {
      console.error("Error creating video call:", callError);
      throw callError;
    }
    
    // Create call invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('call_invitations')
      .insert({
        call_id: videoCall.id,
        inviter_id: userId,
        invitee_id: targetUserId,
        status: 'pending'
      })
      .select()
      .single();
      
    if (inviteError) {
      console.error("Error creating call invitation:", inviteError);
      throw inviteError;
    }
    
    // Send invitation to target user if they're connected
    const targetSocket = connectedClients.get(targetUserId);
    if (targetSocket) {
      targetSocket.send(JSON.stringify({
        type: 'incoming-call',
        callId: videoCall.id,
        invitationId: invitation.id,
        callerId: userId,
        callerName: data.callerName,
        callType: data.callType,
        conversationId: data.conversationId
      }));
    }
    
    // Confirm to caller
    socket.send(JSON.stringify({
      type: 'call-initiated',
      callId: videoCall.id,
      invitationId: invitation.id,
      status: 'pending'
    }));
    
    console.log(`Call invitation sent from ${userId} to ${targetUserId}`);
  } catch (error) {
    console.error("Error handling call invitation:", error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Failed to send call invitation',
      error: error.message
    }));
  }
}

async function handleCallResponse(socket: WebSocket, message: SignalingMessage, supabase: any) {
  const { userId, data } = message;
  const { invitationId, accepted, callId } = data;
  
  try {
    // Update invitation status
    const { error: inviteError } = await supabase
      .from('call_invitations')
      .update({
        status: accepted ? 'accepted' : 'declined',
        response_at: new Date().toISOString()
      })
      .eq('id', invitationId);
      
    if (inviteError) {
      console.error("Error updating invitation:", inviteError);
      throw inviteError;
    }
    
    // Update call status
    const { error: callError } = await supabase
      .from('video_calls')
      .update({
        status: accepted ? 'ringing' : 'declined',
        answered_at: accepted ? new Date().toISOString() : null
      })
      .eq('id', callId);
      
    if (callError) {
      console.error("Error updating call:", callError);
      throw callError;
    }
    
    // Get caller info
    const { data: call } = await supabase
      .from('video_calls')
      .select('caller_id')
      .eq('id', callId)
      .single();
    
    if (call) {
      const callerSocket = connectedClients.get(call.caller_id);
      if (callerSocket) {
        callerSocket.send(JSON.stringify({
          type: 'call-response',
          callId,
          accepted,
          responderId: userId
        }));
      }
    }
    
    console.log(`Call ${accepted ? 'accepted' : 'declined'} by ${userId}`);
  } catch (error) {
    console.error("Error handling call response:", error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Failed to process call response',
      error: error.message
    }));
  }
}

async function handleWebRTCSignaling(socket: WebSocket, message: SignalingMessage) {
  const { callId, targetUserId, type, data } = message;
  
  // Forward WebRTC signaling to target user
  const targetSocket = connectedClients.get(targetUserId!);
  if (targetSocket) {
    targetSocket.send(JSON.stringify({
      type,
      callId,
      data,
      senderId: message.userId
    }));
    console.log(`Forwarded ${type} signal for call ${callId}`);
  } else {
    console.log(`Target user ${targetUserId} not connected for ${type} signal`);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Target user not available',
      callId
    }));
  }
}