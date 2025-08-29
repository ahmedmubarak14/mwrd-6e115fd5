import React from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
};

const pageTransition: Transition = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1],
  duration: 0.4,
};

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideUpTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        type: "tween"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};