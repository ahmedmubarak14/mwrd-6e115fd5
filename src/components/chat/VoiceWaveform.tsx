import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VoiceWaveformProps {
  isRecording?: boolean;
  audioLevel?: number;
  className?: string;
}

export const VoiceWaveform = ({ 
  isRecording = false, 
  audioLevel = 0, 
  className 
}: VoiceWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [bars, setBars] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    if (!isRecording) {
      setBars(new Array(20).fill(0));
      return;
    }

    const animate = () => {
      setBars(prev => {
        const newBars = [...prev];
        // Shift bars to the left
        for (let i = 0; i < newBars.length - 1; i++) {
          newBars[i] = newBars[i + 1];
        }
        // Add new bar based on audio level
        newBars[newBars.length - 1] = Math.random() * audioLevel * 100 + 10;
        return newBars;
      });

      if (isRecording) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, audioLevel]);

  return (
    <div className={cn("flex items-center justify-center gap-1 h-8", className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="bg-primary rounded-full w-1 transition-all duration-150"
          style={{ 
            height: `${Math.max(4, height)}px`,
            opacity: isRecording ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );
};