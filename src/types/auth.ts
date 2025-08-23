export interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'vendor' | 'admin';
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  bio?: string;
  categories?: string[];
  subscription_plan?: string;
  subscription_status?: string;
  status?: 'pending' | 'approved' | 'blocked' | 'rejected';
}

export type UserRole = 'client' | 'vendor' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked' | 'rejected';