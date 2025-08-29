import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { usePerformanceOptimizations } from './usePerformanceOptimizations';

interface RouteAnimationState {
  isNavigating: boolean;
  previousPath: string | null;
  direction: 'forward' | 'backward' | 'replace';
  progress: number;
}

export const useRouteAnimation = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { navigationConfig, performanceConfig } = usePerformanceOptimizations();
  
  const [animationState, setAnimationState] = useState<RouteAnimationState>({
    isNavigating: false,
    previousPath: null,
    direction: 'forward',
    progress: 0
  });

  useEffect(() => {
    // Start navigation animation
    setAnimationState(prev => ({
      ...prev,
      isNavigating: true,
      previousPath: prev.previousPath || location.pathname,
      direction: navigationType === 'POP' ? 'backward' : 
                navigationType === 'REPLACE' ? 'replace' : 'forward',
      progress: 0
    }));

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnimationState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 20, 90)
      }));
    }, 100);

    // Complete navigation
    const completeTimeout = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        isNavigating: false,
        progress: 100,
        previousPath: location.pathname
      }));
      
      // Reset progress after animation
      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          progress: 0
        }));
      }, 200);
    }, navigationConfig.loadingThreshold);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [location.pathname, navigationType, navigationConfig.loadingThreshold]);

  // Get animation variants based on direction and performance
  const getAnimationVariants = () => {
    if (!performanceConfig.enableAnimations) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      };
    }

    const baseTransition = {
      type: "tween" as const,
      ease: [0.4, 0, 0.2, 1],
      duration: parseFloat(performanceConfig.transitionDuration) / 1000
    };

    switch (animationState.direction) {
      case 'forward':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          transition: baseTransition
        };
      case 'backward':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: baseTransition
        };
      case 'replace':
      default:
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
          transition: baseTransition
        };
    }
  };

  return {
    animationState,
    getAnimationVariants,
    shouldAnimate: performanceConfig.enableAnimations && navigationConfig.enablePageTransitions
  };
};