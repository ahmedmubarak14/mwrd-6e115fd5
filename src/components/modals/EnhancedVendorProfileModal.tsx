import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  Users, 
  Calendar,
  CheckCircle,
  MessageCircle,
  Video,
  Building2,
  TrendingUp,
  Shield,
  Package,
  Timer,
  ThumbsUp,
  FileText,
  ExternalLink,
  Briefcase,
  Target,
  CheckCircle2,
  Factory,
  Wrench,
  ShoppingBag
} from "lucide-react";
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { PrivateRequestModal } from './PrivateRequestModal';
import { VideoCallModal } from './VideoCallModal';
import { PublicVendorProductCatalog } from '@/components/vendor/PublicVendorProductCatalog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from 'date-fns';

interface EnhancedVendorProfileModalProps {
  children: React.ReactNode;
  vendorId: string;
}

export const EnhancedVendorProfileModal: React.FC<EnhancedVendorProfileModalProps> = ({
  children,
  vendorId
}) => {
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startConversation } = useRealTimeChat();
  const { startCall } = useVideoCall();
  
  const [open, setOpen] = useState(false);
  const [showPrivateRequestModal, setShowPrivateRequestModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isLoadingCall, setIsLoadingCall] = useState(false);

  const { vendorProfile, loading, error } = useVendorProfile(vendorId);

  const handleStartConversation = async () => {
    if (!user || !vendorProfile) return;
    
    setIsLoadingMessage(true);
    try {
      const conversation = await startConversation(vendorProfile.user_id);
      if (conversation) {
        toast({
          title: isArabic ? "تم بدء المحادثة" : "Conversation Started",
          description: isArabic ? "تم توجيهك إلى الرسائل" : "Redirected to messages"
        });
        setOpen(false);
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "فشل في بدء المحادثة" : "Failed to start conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const handleStartCall = async () => {
    if (!user || !vendorProfile) return;
    
    setIsLoadingCall(true);
    try {
      await startCall(vendorProfile.user_id, true);
      setShowVideoCallModal(true);
      toast({
        title: isArabic ? "تم بدء المكالمة" : "Call Started",
        description: isArabic ? "جاري الاتصال..." : "Connecting..."
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "فشل في بدء المكالمة" : "Failed to start call",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCall(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getVerificationBadge = (status: string) => {
    const variants = {
      verified: { color: "bg-green-100 text-green-800", icon: CheckCircle2, text: isArabic ? "موثق" : "Verified" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: isArabic ? "قيد المراجعة" : "Pending" },
      rejected: { color: "bg-red-100 text-red-800", icon: Shield, text: isArabic ? "مرفوض" : "Rejected" }
    };
    
    const variant = variants[status as keyof typeof variants] || variants.pending;
    const IconComponent = variant.icon;
    
    return (
      <Badge className={variant.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {variant.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !vendorProfile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              {isArabic ? "فشل في تحميل بيانات المورد" : "Failed to load vendor profile"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isArabic ? "ملف المورد" : "Vendor Profile"}
            </DialogTitle>
          </DialogHeader>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={vendorProfile.avatar_url} alt={vendorProfile.full_name} />
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {vendorProfile.company_name?.charAt(0) || vendorProfile.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {vendorProfile.company_name || vendorProfile.full_name}
                </h2>
                {vendorProfile.company_name && (
                  <p className="text-lg text-muted-foreground">{vendorProfile.full_name}</p>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  {renderStars(vendorProfile.avg_rating)}
                  <span className="ml-2 font-medium">{vendorProfile.avg_rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({vendorProfile.total_reviews} {isArabic ? "تقييم" : "reviews"})
                  </span>
                </div>
                {getVerificationBadge(vendorProfile.verification_status)}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {vendorProfile.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vendorProfile.address}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {isArabic ? "عضو منذ" : "Member since"} {format(new Date(vendorProfile.created_at), 'MMM yyyy')}
                </div>
                {vendorProfile.established_year && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {isArabic ? `تأسست في ${vendorProfile.established_year}` : `Est. ${vendorProfile.established_year}`}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 min-w-[140px]">
              <Button 
                onClick={handleStartConversation}
                disabled={isLoadingMessage || !user}
                className="w-full"
              >
                {isLoadingMessage ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isArabic ? 'رسالة مباشرة' : 'Direct Message'}
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleStartCall}
                disabled={isLoadingCall || !user}
                className="w-full"
              >
                {isLoadingCall ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    {isArabic ? 'مكالمة مرئية' : 'Video Call'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{isArabic ? "نظرة عامة" : "Overview"}</TabsTrigger>
              <TabsTrigger value="products">{isArabic ? "المنتجات" : "Products"}</TabsTrigger>
              <TabsTrigger value="details">{isArabic ? "التفاصيل" : "Details"}</TabsTrigger>
              <TabsTrigger value="portfolio">{isArabic ? "أعمال سابقة" : "Portfolio"}</TabsTrigger>
              <TabsTrigger value="stats">{isArabic ? "إحصائيات" : "Statistics"}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      {isArabic ? "نبذة عنا" : "About"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {vendorProfile.bio || (isArabic ? "لا توجد معلومات متاحة" : "No information available")}
                    </p>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      {isArabic ? "التخصصات" : "Specializations"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vendorProfile.categories && vendorProfile.categories.length > 0 ? (
                        vendorProfile.categories.map((category, index) => (
                          <Badge key={category.id || index} variant="secondary">
                            {isArabic ? category.name_ar : category.name_en}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          {isArabic ? "لم يتم تحديد تخصصات" : "No specializations specified"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      {isArabic ? "معلومات التواصل" : "Contact Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{vendorProfile.email}</span>
                    </div>
                    {vendorProfile.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{vendorProfile.phone}</span>
                      </div>
                    )}
                    {vendorProfile.portfolio_url && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a 
                          href={vendorProfile.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {isArabic ? "موقع الشركة" : "Website"}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {isArabic ? "إحصائيات سريعة" : "Quick Stats"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isArabic ? "معدل الاستجابة" : "Response Rate"}</span>
                      <span className="font-medium">{vendorProfile.response_rate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isArabic ? "وقت الاستجابة" : "Response Time"}</span>
                      <span className="font-medium">{vendorProfile.avg_response_time_hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isArabic ? "المشاريع المكتملة" : "Completed Projects"}</span>
                      <span className="font-medium">{vendorProfile.total_completed_orders}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <PublicVendorProductCatalog 
                vendorId={vendorId} 
                vendorName={vendorProfile.company_name || vendorProfile.full_name}
              />
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      {isArabic ? "معلومات الشركة" : "Business Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vendorProfile.business_size && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isArabic ? "حجم الشركة" : "Business Size"}</span>
                        <span>{vendorProfile.business_size}</span>
                      </div>
                    )}
                    {vendorProfile.employee_count && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isArabic ? "عدد الموظفين" : "Employee Count"}</span>
                        <span>{vendorProfile.employee_count}</span>
                      </div>
                    )}
                    {vendorProfile.experience_years && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isArabic ? "سنوات الخبرة" : "Years of Experience"}</span>
                        <span>{vendorProfile.experience_years} {isArabic ? "سنة" : "years"}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Certifications */}
                {vendorProfile.certifications && vendorProfile.certifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        {isArabic ? "الشهادات والاعتمادات" : "Certifications"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {vendorProfile.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Equipment & Tools */}
                {vendorProfile.equipment && vendorProfile.equipment.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wrench className="h-5 w-5 mr-2" />
                        {isArabic ? "المعدات والأدوات" : "Equipment & Tools"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {vendorProfile.equipment.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Coverage Locations */}
                {vendorProfile.coverage_locations && vendorProfile.coverage_locations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {isArabic ? "مناطق التغطية" : "Service Areas"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {vendorProfile.coverage_locations.map((location, index) => (
                          <Badge key={index} variant="secondary">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    {isArabic ? "الأعمال السابقة" : "Previous Work"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {isArabic ? "لا توجد أعمال سابقة متاحة للعرض" : "No portfolio items available to display"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{isArabic ? "إجمالي العروض" : "Total Offers"}</p>
                        <p className="text-2xl font-bold">{vendorProfile.total_offers}</p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{isArabic ? "المشاريع المكتملة" : "Completed Projects"}</p>
                        <p className="text-2xl font-bold">{vendorProfile.total_completed_orders}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{isArabic ? "معدل النجاح" : "Success Rate"}</p>
                        <p className="text-2xl font-bold">
                          {vendorProfile.total_offers > 0 
                            ? ((vendorProfile.total_completed_orders / vendorProfile.total_offers) * 100).toFixed(0)
                            : 0}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>{isArabic ? "تقييم الأداء" : "Performance Metrics"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>{isArabic ? "معدل الاستجابة" : "Response Rate"}</span>
                        <span>{vendorProfile.response_rate.toFixed(0)}%</span>
                      </div>
                      <Progress value={vendorProfile.response_rate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>{isArabic ? "تقييم العملاء" : "Customer Rating"}</span>
                        <span>{vendorProfile.avg_rating.toFixed(1)}/5.0</span>
                      </div>
                      <Progress value={(vendorProfile.avg_rating / 5) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons Footer */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowPrivateRequestModal(true)}
              className="flex-1"
            >
              {isArabic ? 'طلب خاص' : 'Private Request'}
            </Button>
            <Button 
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  navigate('/requests/create');
                }, 100);
              }}
              className="flex-1"
            >
              {isArabic ? 'طلب عام' : 'Public Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <PrivateRequestModal
        open={showPrivateRequestModal}
        onOpenChange={setShowPrivateRequestModal}
        vendorId={vendorId}
        vendorName={vendorProfile.company_name || vendorProfile.full_name}
      />
      
      <VideoCallModal 
        isOpen={showVideoCallModal}
        onClose={() => setShowVideoCallModal(false)}
        recipientId={vendorId}
        recipientName={vendorProfile.company_name || vendorProfile.full_name}
        recipientAvatar={vendorProfile.avatar_url || ""}
      />
    </>
  );
};