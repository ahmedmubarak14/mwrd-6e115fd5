
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { generateCSRFToken, generateNonce } from '@/utils/securityValidation';

interface SecurityContextType {
  csrfToken: string;
  nonce: string;
  refreshTokens: () => void;
  isSecureContext: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [nonce, setNonce] = useState<string>('');
  const [isSecureContext] = useState(() => {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  });

  const refreshTokens = useCallback(() => {
    setCsrfToken(generateCSRFToken());
    setNonce(generateNonce());
  }, []);

  useEffect(() => {
    // Initialize tokens
    refreshTokens();

    // Refresh tokens periodically (every 30 minutes)
    const interval = setInterval(refreshTokens, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refreshTokens]);

  // Add security headers programmatically where possible
  useEffect(() => {
    // Set secure cookie attributes
    document.cookie = `secure=${isSecureContext ? 'true' : 'false'}; SameSite=Strict; Path=/`;
    
    // Add CSP meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute('content', 
        `default-src 'self'; ` +
        `script-src 'self' 'nonce-${nonce}' https://jpxqywtitjjphkiuokov.supabase.co; ` +
        `style-src 'self' 'unsafe-inline'; ` +
        `img-src 'self' data: https://jpxqywtitjjphkiuokov.supabase.co; ` +
        `font-src 'self'; ` +
        `connect-src 'self' https://jpxqywtitjjphkiuokov.supabase.co wss://jpxqywtitjjphkiuokov.supabase.co; ` +
        `frame-ancestors 'none'; ` +
        `base-uri 'self';`
      );
      document.head.appendChild(meta);
    }
  }, [nonce, isSecureContext]);

  const value = {
    csrfToken,
    nonce,
    refreshTokens,
    isSecureContext
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
