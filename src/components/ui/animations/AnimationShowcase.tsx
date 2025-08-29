import React from 'react';
import { AnimatedButton, AnimatedCard, FloatingElement, StaggeredList, PulseGlow } from './index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Heart } from 'lucide-react';

export const AnimationShowcase = () => {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <FloatingElement className="inline-block">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ✨ Enhanced UI Animations
          </h1>
        </FloatingElement>
        <p className="text-muted-foreground">Beautiful micro-interactions and smooth transitions</p>
      </div>

      {/* Interactive Buttons */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Interactive Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton animation="spring" variant="default">
            <Sparkles className="w-4 h-4 mr-2" />
            Spring Effect
          </AnimatedButton>
          <AnimatedButton animation="lift" variant="outline">
            <Zap className="w-4 h-4 mr-2" />
            Lift Effect
          </AnimatedButton>
          <AnimatedButton animation="glow" variant="destructive">
            <Heart className="w-4 h-4 mr-2" />
            Glow Effect
          </AnimatedButton>
        </CardContent>
      </Card>

      {/* Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard hoverEffect="lift" className="p-6">
          <h3 className="font-semibold mb-2">Lift Animation</h3>
          <p className="text-sm text-muted-foreground">Hover to see the card lift with a smooth shadow</p>
        </AnimatedCard>
        
        <AnimatedCard hoverEffect="tilt" className="p-6">
          <h3 className="font-semibold mb-2">3D Tilt</h3>
          <p className="text-sm text-muted-foreground">Experience subtle 3D perspective on hover</p>
        </AnimatedCard>
        
        <PulseGlow className="rounded-lg">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Pulse Glow</h3>
            <p className="text-sm text-muted-foreground">Continuous glowing animation effect</p>
          </Card>
        </PulseGlow>
      </div>

      {/* Staggered List Animation */}
      <Card>
        <CardHeader>
          <CardTitle>Staggered Animations</CardTitle>
        </CardHeader>
        <CardContent>
          <StaggeredList className="space-y-3">
            {['First item animates in', 'Then the second item', 'Finally the third item', 'Creating a beautiful cascade'].map((text) => (
              <div key={text} className="p-4 bg-muted rounded-lg">
                {text}
              </div>
            ))}
          </StaggeredList>
        </CardContent>
      </Card>
    </div>
  );
};