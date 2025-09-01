// Mobile-specific utilities and optimizations

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroidDevice = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const getViewportHeight = (): number => {
  return Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
};

export const preventIOSZoom = (element: HTMLInputElement | HTMLTextAreaElement): void => {
  if (isIOSDevice()) {
    element.style.fontSize = '16px';
  }
};

export const enableSmoothScrolling = (): void => {
  document.documentElement.style.scrollBehavior = 'smooth';
};

export const disableOverscroll = (element: HTMLElement): void => {
  element.style.overscrollBehavior = 'contain';
};

// Haptic feedback for mobile interactions
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[type]);
  }
};

// Performance optimization for mobile
export const optimizeForMobile = (): void => {
  // Disable hover effects on touch devices
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }

  // Enable hardware acceleration
  document.body.style.transform = 'translateZ(0)';
  document.body.style.backfaceVisibility = 'hidden';

  // Optimize scrolling
  enableSmoothScrolling();
  
  // Prevent overscroll bounce on iOS
  if (isIOSDevice()) {
    document.body.style.overscrollBehavior = 'none';
  }
};

// Initialize mobile optimizations
export const initMobileOptimizations = (): void => {
  if (typeof window !== 'undefined') {
    optimizeForMobile();
  }
};