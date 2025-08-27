import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityMetrics {
  overallScore: number;
  failedLogins: number;
  activeSessions: number;
  incidents: number;
  recentEvents: SecurityEvent[];
}

export interface SecurityEvent {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  type: 'login_attempt' | 'suspicious_activity' | 'security_scan';
  timestamp: string;
}

export const useSecurityAnalytics = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [threatData, setThreatData] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [activeThreats, setActiveThreats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSecurityMetrics = async () => {
    try {
      // Mock security metrics - in production, these would come from real security monitoring
      const mockMetrics: SecurityMetrics = {
        overallScore: 85,
        failedLogins: 12,
        activeSessions: 156,
        incidents: 2,
        recentEvents: [
          {
            title: 'Multiple Failed Login Attempts',
            description: 'User attempted login 5 times from unknown IP',
            severity: 'medium',
            type: 'login_attempt',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            title: 'Suspicious API Activity',
            description: 'Unusual API call pattern detected',
            severity: 'low',
            type: 'suspicious_activity',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Security Scan Completed',
            description: 'Automated security scan found no vulnerabilities',
            severity: 'low',
            type: 'security_scan',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ]
      };

      // Mock threat data
      const mockThreatData = [
        { category: 'Brute Force', count: 3 },
        { category: 'SQL Injection', count: 0 },
        { category: 'XSS Attempts', count: 1 },
        { category: 'CSRF', count: 0 },
        { category: 'DDoS', count: 0 }
      ];

      // Mock login attempts over time
      const mockLoginAttempts = Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}:00`,
        successful: Math.floor(Math.random() * 50) + 20,
        failed: Math.floor(Math.random() * 10)
      }));

      setSecurityMetrics(mockMetrics);
      setThreatData(mockThreatData);
      setLoginAttempts(mockLoginAttempts);
      setActiveThreats([]); // No active threats in mock data
      
    } catch (error) {
      console.error('Error fetching security metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityMetrics();
    
    // Set up real-time monitoring (mock)
    const interval = setInterval(fetchSecurityMetrics, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    securityMetrics,
    threatData,
    loginAttempts,
    activeThreats,
    isLoading,
    refreshMetrics: fetchSecurityMetrics
  };
};