import React, { Suspense } from 'react';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';
import { EnhancedLoadingSpinner } from './EnhancedLoadingStates';

interface OptimizedPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const OptimizedPageTransition = ({ children, className }: OptimizedPageTransitionProps) => {
  const location = useLocation();
  const { performanceConfig, navigationConfig, registerAnimation, measurePerformance } = usePerformanceOptimizations();

  // Animation variants based on performance config
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      ...(performanceConfig.enableAnimations ? {
        y: performanceConfig.useGPU ? 20 : 0,
        scale: performanceConfig.useGPU ? 0.98 : 1,
      } : {})
    },
    in: {
      opacity: 1,
      ...(performanceConfig.enableAnimations ? {
        y: 0,
        scale: 1,
      } : {})
    },
    out: {
      opacity: 0,
      ...(performanceConfig.enableAnimations ? {
        y: performanceConfig.useGPU ? -20 : 0,
        scale: performanceConfig.useGPU ? 0.98 : 1,
      } : {})
    },
  };

  const pageTransition: Transition = {
    type: performanceConfig.useGPU ? "tween" : "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: performanceConfig.enableAnimations ? 
      parseFloat(performanceConfig.transitionDuration) / 1000 : 0,
  };

  if (!navigationConfig.enablePageTransitions) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <EnhancedLoadingSpinner size="lg" variant="spinner" />
        </div>
      }>
        <div className={className}>{children}</div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedLoadingSpinner size="lg" variant="spinner" />
      </div>
    }>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className={className}
          onAnimationStart={() => {
            const cleanup = registerAnimation();
            measurePerformance(`Page transition to ${location.pathname}`, () => {});
            return cleanup;
          }}
          style={{
            ...(performanceConfig.useGPU ? {
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            } : {})
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default OptimizedPageTransition;