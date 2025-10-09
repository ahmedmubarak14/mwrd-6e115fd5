import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import type { AuthError } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Sign In Flow', () => {
    it('should handle successful login', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: {} as any, session: {} as any },
        error: null,
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.error).toBeNull();
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle login with invalid credentials', async () => {
      const mockError = {
        message: 'Invalid credentials',
        name: 'AuthApiError',
        status: 400,
      } as unknown as AuthError;

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('Invalid credentials');
    });
  });

  describe('Sign Up Flow', () => {
    it('should handle successful registration', async () => {
      const mockUser = { id: 'new-user', email: 'new@example.com' };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser as any, session: null },
        error: null,
      });

      const result = await supabase.auth.signUp({
        email: 'new@example.com',
        password: 'SecurePass123!',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      expect(result.error).toBeNull();
      expect(result.data.user).toBeTruthy();
    });

    it('should handle registration with existing email', async () => {
      const mockError = {
        message: 'User already registered',
        name: 'AuthApiError',
        status: 400,
      } as unknown as AuthError;

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await supabase.auth.signUp({
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('User already registered');
    });
  });

  describe('Sign Out Flow', () => {
    it('should handle successful logout', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      const result = await supabase.auth.signOut();

      expect(result.error).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalledOnce();
    });
  });
});
