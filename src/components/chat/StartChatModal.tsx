
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";

interface StartChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  role: string;
  avatar_url?: string;
  verification_status: string;
  status: string;
}

export const StartChatModal = ({ open, onOpenChange }: StartChatModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, full_name, company_name, role, avatar_url, verification_status, status')
        .neq('user_id', userProfile?.user_id)
        .eq('status', 'approved')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.company_name?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
    setIsChatModalOpen(true);
    onOpenChange(false);
  };

  const handleChatModalClose = () => {
    setIsChatModalOpen(false);
    setSelectedUser(null);
  };

  const getUserDisplayName = (user: UserProfile) => {
    return user.full_name || user.company_name || 'Unknown User';
  };

  const getRoleIcon = (role: string) => {
    return role === 'vendor' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'vendor': return 'secondary';
      case 'client': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No users found matching your search' : 'No users available'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {getUserDisplayName(user)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {getUserDisplayName(user)}
                          </span>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            <span className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {user.role}
                            </span>
                          </Badge>
                        </div>
                        
                        {user.verification_status === 'approved' && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <QuickChatModal
          open={isChatModalOpen}
          onOpenChange={handleChatModalClose}
          recipientId={selectedUser.user_id}
          recipientName={getUserDisplayName(selectedUser)}
          conversationType="business"
        />
      )}
    </>
  );
};
