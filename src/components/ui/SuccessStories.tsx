import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Building2, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive: boolean;
}

interface SuccessStory {
  id: string;
  type: 'client' | 'vendor';
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  metrics: SuccessMetric[];
  quote: string;
  author: string;
  position: string;
  timeline: string;
  featured: boolean;
}

interface SuccessStoriesProps {
  className?: string;
  isRTL?: boolean;
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    type: 'client',
    company: 'شركة البناء المتقدم',
    industry: 'البناء والتشييد',
    challenge: 'صعوبة في العثور على موردين موثوقين للمواد الخام وتأخير في التسليم',
    solution: 'استخدام نظام MWRD للعثور على موردين معتمدين وإدارة الطلبات',
    metrics: [
      { label: 'توفير في التكلفة', value: '35%', change: '+35%', icon: DollarSign, positive: true },
      { label: 'تحسن في التسليم', value: '60%', change: '+60%', icon: Clock, positive: true },
      { label: 'موردين جدد', value: '12', change: '+12', icon: Users, positive: true }
    ],
    quote: 'MWRD غيرت طريقة عملنا بالكامل. أصبحنا نحصل على أفضل الأسعار وأسرع التسليمات.',
    author: 'محمد العلي',
    position: 'مدير المشتريات',
    timeline: '6 أشهر',
    featured: true
  },
  {
    id: '2',
    type: 'vendor',
    company: 'Gulf Steel Industries',
    industry: 'Steel Manufacturing',
    challenge: 'Limited client reach and difficulty finding qualified buyers for specialized products',
    solution: 'Joined MWRD platform to expand market reach and streamline sales process',
    metrics: [
      { label: 'Revenue Growth', value: '85%', change: '+85%', icon: TrendingUp, positive: true },
      { label: 'New Clients', value: '24', change: '+24', icon: Building2, positive: true },
      { label: 'Deal Closure Time', value: '40%', change: '-40%', icon: Clock, positive: true }
    ],
    quote: 'The platform connected us with clients we could never reach before. Our business has transformed.',
    author: 'Sarah Al-Mansouri',
    position: 'Sales Director',
    timeline: '8 months',
    featured: true
  },
  {
    id: '3',
    type: 'client',
    company: 'مجموعة الخليج للضيافة',
    industry: 'الضيافة والفنادق',
    challenge: 'إدارة معقدة لموردين متعددين وتحديات في ضمان الجودة',
    solution: 'نظام إدارة الموردين المتكامل وتقييم الأداء المستمر',
    metrics: [
      { label: 'تحسن الجودة', value: '45%', change: '+45%', icon: Award, positive: true },
      { label: 'كفاءة العمليات', value: '50%', change: '+50%', icon: TrendingUp, positive: true },
      { label: 'رضا العملاء', value: '92%', change: '+15%', icon: CheckCircle, positive: true }
    ],
    quote: 'المنصة ساعدتنا في توحيد عمليات الشراء وتحسين جودة الخدمات المقدمة لضيوفنا.',
    author: 'نوره الزهراني',
    position: 'مديرة العمليات',
    timeline: '4 أشهر',
    featured: false
  }
];

export const SuccessStories = ({ className = '', isRTL = false }: SuccessStoriesProps) => {
  const [selectedType, setSelectedType] = useState<'all' | 'client' | 'vendor'>('all');
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const filteredStories = successStories.filter(story => 
    selectedType === 'all' || story.type === selectedType
  );

  const featuredStories = filteredStories.filter(story => story.featured);
  const regularStories = filteredStories.filter(story => !story.featured);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-white">
          {isRTL ? 'قصص نجاح حقيقية' : 'Real Success Stories'}
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          {isRTL 
            ? 'اكتشف كيف غيرت منصة MWRD أعمال عملائنا وموردينا'
            : 'Discover how MWRD platform transformed our clients and vendors businesses'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1 bg-white/10 rounded-lg backdrop-blur-20 border border-white/20">
          {[
            { key: 'all', label: isRTL ? 'الكل' : 'All' },
            { key: 'client', label: isRTL ? 'العملاء' : 'Clients' },
            { key: 'vendor', label: isRTL ? 'الموردون' : 'Vendors' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={selectedType === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedType(tab.key as any)}
              className={cn(
                'px-4 py-2 text-sm transition-all duration-300',
                selectedType === tab.key
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {featuredStories.map((story) => (
            <Card 
              key={story.id} 
              className="group relative overflow-hidden bg-white/10 border border-white/20 backdrop-blur-20 hover:bg-white/15 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
            >
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'mb-2',
                        story.type === 'client' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                      )}
                    >
                      {story.type === 'client' ? (isRTL ? 'عميل' : 'Client') : (isRTL ? 'مورد' : 'Vendor')}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-1">{story.company}</h3>
                    <p className="text-white/60 text-sm">{story.industry}</p>
                  </div>
                  <ArrowRight className={cn(
                    'h-5 w-5 text-white/60 transition-transform duration-300',
                    selectedStory === story.id ? 'rotate-90' : 'group-hover:translate-x-1'
                  )} />
                </div>

                {/* Challenge & Solution Preview */}
                <div className="space-y-3">
                  <p className="text-white/80 text-sm line-clamp-2">
                    <span className="font-semibold">{isRTL ? 'التحدي:' : 'Challenge:'}</span> {story.challenge}
                  </p>
                  {selectedStory === story.id && (
                    <p className="text-white/80 text-sm animate-fade-in">
                      <span className="font-semibold">{isRTL ? 'الحل:' : 'Solution:'}</span> {story.solution}
                    </p>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {story.metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <metric.icon className="h-4 w-4 text-white/60" />
                      </div>
                      <div className="text-lg font-bold text-white">{metric.value}</div>
                      <div className="text-xs text-white/60">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Expanded Content */}
                {selectedStory === story.id && (
                  <div className="space-y-4 animate-fade-in border-t border-white/20 pt-4">
                    <blockquote className="text-white/90 italic">
                      "{story.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-white font-semibold">{story.author}</div>
                        <div className="text-white/60">{story.position}</div>
                      </div>
                      <div className="text-white/60">
                        {isRTL ? 'النتائج في' : 'Results in'} {story.timeline}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Stories */}
      {regularStories.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {regularStories.map((story) => (
            <Card 
              key={story.id} 
              className="group bg-white/5 border border-white/10 backdrop-blur-15 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      story.type === 'client' ? 'border-blue-400/50 text-blue-300' : 'border-green-400/50 text-green-300'
                    )}
                  >
                    {story.type === 'client' ? (isRTL ? 'عميل' : 'Client') : (isRTL ? 'مورد' : 'Vendor')}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
                </div>
                
                <div>
                  <h4 className="font-semibold text-white text-lg">{story.company}</h4>
                  <p className="text-white/60 text-sm">{story.industry}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {story.metrics.slice(0, 3).map((metric, index) => (
                    <div key={index}>
                      <div className="text-sm font-bold text-white">{metric.value}</div>
                      <div className="text-xs text-white/50">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};