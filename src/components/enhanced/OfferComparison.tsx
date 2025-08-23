import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Clock, 
  DollarSign, 
  Star, 
  Award, 
  Zap, 
  Shield, 
  MessageSquare,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowUpDown,
  Filter,
  BarChart3
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SupplierProfile {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  rating: number;
  completedProjects: number;
  responseTime: string;
  location: string;
  verified: boolean;
  specializations: string[];
}

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  supplier: SupplierProfile;
  features: string[];
  guarantees: string[];
  timeline: {
    phase: string;
    duration: number;
    description: string;
  }[];
  portfolioItems?: string[];
  negotiable: boolean;
  paymentTerms: string;
}

interface OfferComparisonProps {
  offers: Offer[];
  onOfferSelect?: (offerId: string) => void;
  onNegotiate?: (offerId: string) => void;
  onMessage?: (supplierId: string) => void;
}

export const OfferComparison: React.FC<OfferComparisonProps> = ({
  offers,
  onOfferSelect,
  onNegotiate,
  onMessage
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'deliveryTime' | 'responseTime'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'premium'>('all');
  const [comparisonMode, setComparisonMode] = useState<'grid' | 'table' | 'detailed'>('grid');
  const [sortedOffers, setSortedOffers] = useState<Offer[]>(offers);

  useEffect(() => {
    let filtered = [...offers];
    
    // Apply filters
    if (filterBy === 'verified') {
      filtered = filtered.filter(offer => offer.supplier.verified);
    } else if (filterBy === 'premium') {
      filtered = filtered.filter(offer => offer.supplier.rating >= 4.5);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.supplier.rating - a.supplier.rating;
        case 'deliveryTime':
          return a.deliveryTime - b.deliveryTime;
        case 'responseTime':
          return parseFloat(a.supplier.responseTime) - parseFloat(b.supplier.responseTime);
        default:
          return 0;
      }
    });

    setSortedOffers(filtered);
  }, [offers, sortBy, filterBy]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const calculateScore = (offer: Offer): number => {
    let score = 0;
    
    // Price competitiveness (30%)
    const avgPrice = offers.reduce((sum, o) => sum + o.price, 0) / offers.length;
    const priceScore = Math.max(0, 100 - ((offer.price - avgPrice) / avgPrice) * 100);
    score += priceScore * 0.3;
    
    // Supplier rating (25%)
    score += (offer.supplier.rating / 5) * 100 * 0.25;
    
    // Delivery time (20%)
    const maxDelivery = Math.max(...offers.map(o => o.deliveryTime));
    const deliveryScore = ((maxDelivery - offer.deliveryTime) / maxDelivery) * 100;
    score += deliveryScore * 0.2;
    
    // Experience (15%)
    const maxProjects = Math.max(...offers.map(o => o.supplier.completedProjects));
    const experienceScore = (offer.supplier.completedProjects / maxProjects) * 100;
    score += experienceScore * 0.15;
    
    // Features and guarantees (10%)
    const featureScore = (offer.features.length + offer.guarantees.length) * 5;
    score += Math.min(featureScore, 100) * 0.1;
    
    return Math.round(score);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedOffers.map((offer) => (
        <Card key={offer.id} className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          {/* Score Badge */}
          <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(calculateScore(offer))}`}>
            {calculateScore(offer)}% {isRTL ? 'تطابق' : 'Match'}
          </div>
          
          <CardHeader className="pb-3">
            {/* Supplier Info */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={offer.supplier.avatar} />
                <AvatarFallback>{offer.supplier.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{offer.supplier.name}</h4>
                  {offer.supplier.verified && (
                    <Shield className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{offer.supplier.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{offer.supplier.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({offer.supplier.completedProjects} {isRTL ? 'مشروع' : 'projects'})
                  </span>
                </div>
              </div>
            </div>

            <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-600">{offer.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{offer.currency}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600">{offer.deliveryTime}</p>
                <p className="text-xs text-muted-foreground">{isRTL ? 'يوم' : 'days'}</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-sm font-medium mb-2">{isRTL ? 'المميزات الرئيسية' : 'Key Features'}</p>
              <div className="flex flex-wrap gap-1">
                {offer.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {offer.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{offer.features.length - 3} {isRTL ? 'المزيد' : 'more'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Response Time */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isRTL ? 'وقت الاستجابة' : 'Response Time'}
              </span>
              <div className="flex items-center gap-1 text-green-600">
                <Zap className="h-3 w-3" />
                <span className="font-medium">{offer.supplier.responseTime}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{offer.supplier.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMessage?.(offer.supplier.id)}
                className="gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                {isRTL ? 'رسالة' : 'Message'}
              </Button>
              <Button 
                size="sm"
                onClick={() => onOfferSelect?.(offer.id)}
                className="gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                {isRTL ? 'اختيار' : 'Select'}
              </Button>
            </div>

            {/* Negotiation Option */}
            {offer.negotiable && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => onNegotiate?.(offer.id)}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {isRTL ? 'قابل للتفاوض' : 'Negotiable'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">
                  {isRTL ? 'المورد' : 'Supplier'}
                </th>
                <th className="text-left p-4 font-medium">
                  {isRTL ? 'السعر' : 'Price'}
                </th>
                <th className="text-left p-4 font-medium">
                  {isRTL ? 'التسليم' : 'Delivery'}
                </th>
                <th className="text-left p-4 font-medium">
                  {isRTL ? 'التقييم' : 'Rating'}
                </th>
                <th className="text-left p-4 font-medium">
                  {isRTL ? 'النقاط' : 'Score'}
                </th>
                <th className="text-left p-4 font-medium">
                  {isRTL ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOffers.map((offer) => (
                <tr key={offer.id} className="border-b hover:bg-muted/25">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={offer.supplier.avatar} />
                        <AvatarFallback className="text-xs">
                          {offer.supplier.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">{offer.supplier.name}</p>
                          {offer.supplier.verified && (
                            <Shield className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {offer.supplier.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-green-600">
                      {offer.price.toLocaleString()} {offer.currency}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{offer.deliveryTime} {isRTL ? 'يوم' : 'days'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{offer.supplier.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getScoreColor(calculateScore(offer))}>
                      {calculateScore(offer)}%
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => onMessage?.(offer.supplier.id)}>
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={() => onOfferSelect?.(offer.id)}>
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {isRTL ? 'مقارنة العروض' : 'Offer Comparison'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'قارن بين العروض واختر الأنسب لك' : 'Compare offers and choose the best one for you'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">{isRTL ? 'السعر' : 'Price'}</SelectItem>
              <SelectItem value="rating">{isRTL ? 'التقييم' : 'Rating'}</SelectItem>
              <SelectItem value="deliveryTime">{isRTL ? 'التسليم' : 'Delivery'}</SelectItem>
              <SelectItem value="responseTime">{isRTL ? 'الاستجابة' : 'Response'}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
              <SelectItem value="verified">{isRTL ? 'موثق' : 'Verified'}</SelectItem>
              <SelectItem value="premium">{isRTL ? 'مميز' : 'Premium'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Toggle */}
      <Tabs value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
        <TabsList>
          <TabsTrigger value="grid" className="gap-2">
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <div className="bg-current rounded-xs"></div>
              <div className="bg-current rounded-xs"></div>
              <div className="bg-current rounded-xs"></div>
              <div className="bg-current rounded-xs"></div>
            </div>
            {isRTL ? 'شبكة' : 'Grid'}
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {isRTL ? 'جدول' : 'Table'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          {renderGridView()}
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          {renderTableView()}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {sortedOffers.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'عروض متاحة' : 'Available Offers'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.min(...sortedOffers.map(o => o.price)).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'أقل سعر' : 'Lowest Price'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.min(...sortedOffers.map(o => o.deliveryTime))}
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'أسرع تسليم' : 'Fastest Delivery'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.max(...sortedOffers.map(o => o.supplier.rating)).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'أعلى تقييم' : 'Highest Rating'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};