// Database type definitions
export type UserRole = 'admin' | 'client' | 'vendor';
export type UserStatus = 'pending' | 'approved' | 'blocked' | 'rejected';
export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  phone?: string;
  address?: string;
  bio?: string;
  portfolio_url?: string;
  verification_documents: any;
  categories: string[];
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

// Conversation and Message interfaces for chat functionality
export interface Conversation {
  id: string;
  participants: string[];
  last_message?: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_status: string;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  client_id: string;
  vendor_id?: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  urgency: string;
  status: RequestStatus;
  admin_approval_status: string;
  location?: string;
  deadline?: string;
  requirements: any;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
}

export interface Order {
  id: string;
  request_id: string;
  client_id: string;
  vendor_id: string;
  title: string;
  description?: string;
  amount: number;
  status: OrderStatus;
  delivery_date?: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  request_id: string;
  vendor_id: string;
  title: string;
  description: string;
  price: number;
  delivery_time?: number;
  status: string;
  client_approval_status: string;
  admin_approval_status: string;
  created_at: string;
  updated_at: string;
  requests?: Request;
  user_profiles?: UserProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read: boolean;
  data: any;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  payment_method?: string;
  transaction_ref?: string;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
}

export interface ExpertConsultation {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  event_type: string;
  event_description?: string;
  message?: string;
  status: string;
  scheduled_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: any;
  new_values?: any;
  reason?: string;
  created_at: string;
}