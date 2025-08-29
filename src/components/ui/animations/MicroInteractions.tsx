import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps, Transition, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'whileHover' | 'whileTap' | 'transition'> {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  animation?: 'spring' | 'lift' | 'scale' | 'glow';
}

export const AnimatedButton = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  animation = 'spring',
  ...props
}: AnimatedButtonProps) => {
  const animations = {
    spring: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring" as const, stiffness: 400, damping: 17 }
    },
    lift: {
      whileHover: { y: -2 },
      whileTap: { y: 0 },
      transition: { type: "tween" as const, duration: 0.15 }
    },
    scale: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "tween" as const, duration: 0.1 }
    },
    glow: {
      whileHover: { 
        scale: 1.02
      },
      whileTap: { scale: 0.98 },
      transition: { type: "tween" as const, duration: 0.2 }
    }
  };

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
        },
        {
          'h-9 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-11 px-8': size === 'lg',
        },
        className
      )}
      {...animations[animation]}
      {...props}
    >
      {children}
    </motion.button>
  );
};

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'whileHover' | 'whileTap'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'scale';
  clickable?: boolean;
  onClick?: () => void;
}

export const AnimatedCard = ({
  children,
  className,
  hoverEffect = 'lift',
  clickable = false,
  onClick,
  ...props
}: AnimatedCardProps) => {
  const effects = {
    lift: {
      whileHover: { 
        y: -8,
        transition: { type: "tween" as const, duration: 0.2 }
      }
    },
    tilt: {
      whileHover: { 
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        transition: { type: "spring" as const, stiffness: 300 }
      }
    },
    glow: {
      whileHover: {
        scale: 1.02,
        transition: { type: "tween" as const, duration: 0.2 }
      }
    },
    scale: {
      whileHover: {
        scale: 1.05,
        transition: { type: "spring" as const, stiffness: 300 }
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        clickable && "cursor-pointer",
        className
      )}
      {...effects[hoverEffect]}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FloatingElement = ({
  children,
  className,
  delay = 0,
  duration = 3
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const StaggeredList = ({
  children,
  className,
  staggerDelay = 0.1
}: StaggeredListProps) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface PulseGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const PulseGlow = ({
  children,
  className,
  glowColor = "rgba(var(--primary-rgb), 0.5)"
}: PulseGlowProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 10px ${glowColor}`,
          `0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
          `0 0 10px ${glowColor}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};