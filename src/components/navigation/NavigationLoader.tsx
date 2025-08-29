import React, { useState, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';
import { Progress } from '@/components/ui/progress';

interface NavigationLoaderProps {
  isVisible?: boolean;
}

export const NavigationLoader = ({ isVisible: externalVisible }: NavigationLoaderProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { navigationConfig, performanceConfig } = usePerformanceOptimizations();
  
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      setIsLoading(true);
      setProgress(0);

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 100);

      // Complete loading after threshold
      const completeTimeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }, navigationConfig.loadingThreshold);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(completeTimeout);
      };
    }
  }, [location.pathname, navigationType, navigationConfig.loadingThreshold]);

  const isVisible = externalVisible !== undefined ? externalVisible : isLoading;

  if (!performanceConfig.enableAnimations) {
    return isVisible ? (
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
        <div 
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/10 backdrop-blur-sm"
          style={{ transformOrigin: 'left' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient-x"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Glow effect for high-performance devices */}
          {performanceConfig.useGPU && (
            <motion.div
              className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: `${progress * 5}px` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ filter: 'blur(2px)' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};