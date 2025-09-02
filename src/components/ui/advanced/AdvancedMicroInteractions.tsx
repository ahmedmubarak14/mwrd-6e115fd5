import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const FloatingElement = ({ 
  children, 
  className = '', 
  intensity = 'medium' 
}: FloatingElementProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const intensityClasses = {
    low: 'animate-[float_6s_ease-in-out_infinite]',
    medium: 'animate-[float_4s_ease-in-out_infinite]',
    high: 'animate-[float_3s_ease-in-out_infinite]'
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-1000',
        isVisible ? intensityClasses[intensity] : '',
        className
      )}
      style={{
        animationDelay: `${Math.random() * 2}s`
      }}
    >
      {children}
    </div>
  );
};

interface PulseOnHoverProps {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
}

export const PulseOnHover = ({ 
  children, 
  className = '', 
  pulseColor = 'rgba(255, 255, 255, 0.3)' 
}: PulseOnHoverProps) => {
  return (
    <div 
      className={cn(
        'relative overflow-hidden group transition-all duration-300',
        className
      )}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${pulseColor} 0%, transparent 70%)`,
          animation: 'pulse 1.5s infinite'
        }}
      />
      {children}
    </div>
  );
};

interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticHover = ({ 
  children, 
  className = '', 
  strength = 20 
}: MagneticHoverProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    setPosition({
      x: deltaX * strength,
      y: deltaY * strength
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={elementRef}
      className={cn('transition-transform duration-300 ease-out', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

interface GlowOnScrollProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowOnScroll = ({ 
  children, 
  className = '', 
  glowColor = 'rgba(59, 130, 246, 0.5)' 
}: GlowOnScrollProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress based on element position in viewport
      const progress = Math.max(
        0,
        Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height))
      );
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn('transition-all duration-300', className)}
      style={{
        boxShadow: `0 0 ${scrollProgress * 40}px ${glowColor}`,
        transform: `scale(${1 + scrollProgress * 0.02})`
      }}
    >
      {children}
    </div>
  );
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const TiltCard = ({ 
  children, 
  className = '', 
  maxTilt = 15 
}: TiltCardProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
    const deltaY = ((e.clientY - centerY) / (rect.height / 2)) * -maxTilt;
    
    setTilt({ x: deltaY, y: deltaX });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn('transition-transform duration-300 ease-out', className)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
};