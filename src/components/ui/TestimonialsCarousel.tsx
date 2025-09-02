import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  location: string;
}

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  isRTL?: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'أحمد المالكي',
    position: 'مدير المشتريات',
    company: 'شركة النهضة للتطوير',
    content: 'منصة MWRD غيرت طريقة عملنا في المشتريات. وفرنا 40% من الوقت و25% من التكاليف من خلال نظام طلب العروض الذكي.',
    rating: 5,
    location: 'الرياض، السعودية'
  },
  {
    id: '2',
    name: 'Sarah Al-Rashid',
    position: 'Procurement Manager',
    company: 'Advanced Construction Co.',
    content: 'The RFQ system is incredibly efficient. We found suppliers we never knew existed and negotiated better deals than ever before.',
    rating: 5,
    location: 'Jeddah, Saudi Arabia'
  },
  {
    id: '3',
    name: 'فهد العتيبي',
    position: 'مالك شركة',
    company: 'العتيبي للمقاولات',
    content: 'كموردين، المنصة ساعدتنا في الوصول إلى عملاء جدد وزيادة أرباحنا بنسبة 60% خلال 6 أشهر فقط.',
    rating: 5,
    location: 'الدمام، السعودية'
  },
  {
    id: '4',
    name: 'Maha Abdullah',
    position: 'Operations Director',
    company: 'Gulf Manufacturing Ltd.',
    content: 'The platform\'s vendor verification process gives us confidence. Every supplier we work with is pre-qualified and reliable.',
    rating: 5,
    location: 'Dammam, Saudi Arabia'
  }
];

export const TestimonialsCarousel = ({
  testimonials = defaultTestimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = '',
  isRTL = false
}: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={cn('relative max-w-4xl mx-auto', className)}>
      {/* Main Testimonial Card */}
      <Card className="relative overflow-hidden bg-white/10 border border-white/20 backdrop-blur-20">
        <CardContent className="p-8 md:p-12">
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 opacity-20">
            <Quote className="h-16 w-16 text-white" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-5 w-5',
                  i < currentTestimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-white/30'
                )}
              />
            ))}
          </div>

          {/* Content */}
          <blockquote className={cn(
            'text-lg md:text-xl leading-relaxed text-white mb-8 font-medium',
            isRTL ? 'text-right' : 'text-left'
          )}>
            "{currentTestimonial.content}"
          </blockquote>

          {/* Author Info */}
          <div className={cn(
            'flex items-center gap-4',
            isRTL ? 'flex-row-reverse text-right' : ''
          )}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold text-lg">
              {currentTestimonial.name.charAt(0)}
            </div>
            <div>
              <div className="text-white font-semibold text-lg">
                {currentTestimonial.name}
              </div>
              <div className="text-white/70 text-sm">
                {currentTestimonial.position}
              </div>
              <div className="text-white/60 text-sm">
                {currentTestimonial.company} • {currentTestimonial.location}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Previous/Next Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="h-10 w-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="h-10 w-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/60'
              )}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white/70 hover:text-white text-xs"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  );
};