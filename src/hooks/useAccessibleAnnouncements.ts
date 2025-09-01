import { useCallback, useRef } from 'react';

// Custom hook for screen reader announcements
export const useAccessibleAnnouncements = () => {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Create announcement container if it doesn't exist
  const ensureAnnouncementContainer = useCallback(() => {
    if (!announcementRef.current) {
      const container = document.createElement('div');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      container.setAttribute('role', 'status');
      container.style.position = 'absolute';
      container.style.left = '-10000px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.overflow = 'hidden';
      container.id = 'accessibility-announcements';
      
      document.body.appendChild(container);
      announcementRef.current = container;
    }
    return announcementRef.current;
  }, []);

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const container = ensureAnnouncementContainer();
    
    // Set the appropriate aria-live level
    container.setAttribute('aria-live', priority);
    
    // Clear and set new message
    container.textContent = '';
    setTimeout(() => {
      container.textContent = message;
    }, 100); // Small delay ensures screen readers pick up the change
  }, [ensureAnnouncementContainer]);

  // Announce loading states
  const announceLoading = useCallback((isLoading: boolean, context: string) => {
    if (isLoading) {
      announce(`Loading ${context}`, 'polite');
    } else {
      announce(`${context} loaded`, 'polite');
    }
  }, [announce]);

  // Announce form validation errors
  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}`, 'assertive');
  }, [announce]);

  // Announce successful actions
  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  // Announce page/view changes
  const announcePageChange = useCallback((pageName: string) => {
    announce(`Navigated to ${pageName}`, 'polite');
  }, [announce]);

  return {
    announce,
    announceLoading,
    announceError,
    announceSuccess, 
    announcePageChange
  };
};