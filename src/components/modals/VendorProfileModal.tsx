
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Video
} from "lucide-react";
import { VideoCallModal } from './VideoCallModal';
import { PrivateRequestModal } from './PrivateRequestModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useState } from 'react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface VendorProfileModalProps {
  children: React.ReactNode;
  vendor: {
    id: string | number;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    description: string;
    completedProjects: number;
    responseTime: string;
    englishName: string;
    englishCategory: string;
    englishLocation: string;
    englishDescription: string;
    englishResponseTime: string;
    avatar_url?: string;
    services?: string[];
    projects?: Array<{ title: string; category: string; }>;
    certifications?: string[];
  };
}

export const VendorProfileModal = ({ children, vendor }: VendorProfileModalProps) => {
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startConversation, sendMessage } = useRealTimeChat();
  const { startCall } = useVideoCall();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showPrivateRequestModal, setShowPrivateRequestModal] = useState(false);
  const [isLoadingCall, setIsLoadingCall] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [open, setOpen] = useState(false);

  const vendorInfo = {
    name: isArabic ? vendor.name : vendor.englishName,
    category: isArabic ? vendor.category : vendor.englishCategory,
    location: isArabic ? vendor.location : vendor.englishLocation,
    description: isArabic ? vendor.description : vendor.englishDescription,
    responseTime: isArabic ? vendor.responseTime : vendor.englishResponseTime
  };

  // Use actual vendor data or provide defaults
  const services = vendor.services || [
    isArabic ? 'خدمات احترافية' : 'Professional Services',
    isArabic ? 'حلول مخصصة' : 'Custom Solutions',
    isArabic ? 'دعم فني' : 'Technical Support'
  ];

  const projects = vendor.projects || [
    { 
      title: isArabic ? 'مشروع حديث' : 'Recent Project', 
      category: vendorInfo.category 
    }
  ];

  const certifications = vendor.certifications || [
    isArabic ? 'شهادة الجودة المعتمدة' : 'ISO Quality Certified',
    isArabic ? 'مورد معتمد' : 'Approved Vendor'
  ];

  const handleSendMessage = async () => {
    setIsLoadingMessage(true);
    try {
      console.log('Starting conversation with vendor:', vendor.id);
      const conversation = await startConversation(vendor.id.toString());
      
      if (conversation) {
        const message = isArabic 
          ? 'مرحباً، أنا مهتم بخدماتكم.'
          : "Hello, I'm interested in your services.";
        
        console.log('Sending message to conversation:', conversation.id);
        await sendMessage(
          conversation.id, 
          message, 
          vendor.id.toString()
        );
        
        toast({
          title: isArabic ? 'تم إرسال الرسالة' : 'Message Sent',
          description: isArabic 
            ? `تم إرسال رسالتك إلى ${vendorInfo.name}. جاري توجيهك إلى صفحة المحادثات.`
            : `Your message has been sent to ${vendorInfo.name}. Redirecting to messages.`,
        });

        // Close modal and navigate to messages
        setOpen(false);
        setTimeout(() => {
          navigate('/messages');
        }, 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: isArabic ? 'فشل في إرسال الرسالة' : 'Failed to Send Message',
        description: isArabic 
          ? 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while sending the message. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const handleVideoCall = async () => {
    setIsLoadingCall(true);
    try {
      // First create a conversation for the video call
      console.log('Starting video call conversation with vendor:', vendor.id);
      const conversation = await startConversation(vendor.id.toString());
      
      if (conversation) {
        const message = isArabic 
          ? 'أود إجراء مكالمة مرئية معكم. هل أنتم متاحون؟'
          : "I'd like to have a video call with you. Are you available?";
        
        await sendMessage(
          conversation.id, 
          message, 
          vendor.id.toString()
        );

        toast({
          title: isArabic ? 'طلب المكالمة المرئية' : 'Video Call Request',
          description: isArabic 
            ? `تم إرسال طلب المكالمة المرئية إلى ${vendorInfo.name}. جاري توجيهك إلى صفحة المحادثات.`
            : `Video call request sent to ${vendorInfo.name}. Redirecting to messages.`,
        });

        // Close modal and navigate to messages
        setOpen(false);
        setTimeout(() => {
          navigate('/messages');
        }, 500);
      }
    } catch (error) {
      console.error('Error initiating video call:', error);
      toast({
        title: isArabic ? 'فشل في طلب المكالمة' : 'Call Request Failed',
        description: isArabic 
          ? 'حدث خطأ أثناء طلب المكالمة. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while requesting the call. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoadingCall(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {vendor.avatar_url ? (
                <AvatarImage src={vendor.avatar_url} alt={vendorInfo.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                  {vendorInfo.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{vendorInfo.name}</DialogTitle>
              <DialogDescription className="text-lg text-primary font-medium">
                {vendorInfo.category}
              </DialogDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-muted-foreground">
                    ({vendor.reviews} {isArabic ? 'تقييم' : 'reviews'})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{vendorInfo.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                className="bg-gradient-to-r from-primary to-accent"
                onClick={handleSendMessage}
                disabled={isLoadingMessage}
              >
                {isLoadingMessage ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <MessageCircle className="h-4 w-4 mr-2" />
                )}
                {isArabic ? 'إرسال رسالة' : 'Send Message'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleVideoCall}
                disabled={isLoadingCall}
              >
                {isLoadingCall ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Video className="h-4 w-4 mr-2" />
                )}
                {isArabic ? 'مكالمة مرئية' : 'Video Call'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{vendor.completedProjects}+</div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'مشاريع مكتملة' : 'Projects Completed'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="font-bold text-accent">{vendorInfo.responseTime}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'متوسط وقت الاستجابة' : 'Avg Response Time'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'رضا العملاء' : 'Client Satisfaction'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'نبذة عنا' : 'About'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{vendorInfo.description}</p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'الخدمات المقدمة' : 'Services Offered'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'المشاريع الحديثة' : 'Recent Projects'}</CardTitle>
              <CardDescription>
                {isArabic ? 'بعض من أعمالنا الأخيرة' : 'Some of our latest work'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projects.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {item.title.split(' ').map(word => word[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {isArabic ? 'الشهادات والجوائز' : 'Certifications & Awards'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Communication Section */}
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'التواصل' : 'Communication'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                {isArabic 
                  ? 'جميع المراسلات مع هذا المورد تتم داخل منصة MWRD لضمان الأمان والشفافية.'
                  : 'All communication with this vendor happens within the MWRD platform to ensure security and transparency.'
                }
              </p>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={handleSendMessage}
                  disabled={isLoadingMessage}
                >
                  {isLoadingMessage ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <MessageCircle className="h-4 w-4 mr-2" />
                  )}
                  {isArabic ? 'رسالة مباشرة' : 'Direct Message'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleVideoCall}
                  disabled={isLoadingCall}
                >
                  {isLoadingCall ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Video className="h-4 w-4 mr-2" />
                  )}
                  {isArabic ? 'مكالمة مرئية' : 'Video Call'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPrivateRequestModal(true)}
                >
                  {isArabic ? 'طلب خاص' : 'Private Request'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => {
                      navigate('/requests/create');
                    }, 100);
                  }}
                >
                  {isArabic ? 'طلب عام' : 'Public Request'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      
      <PrivateRequestModal
        open={showPrivateRequestModal}
        onOpenChange={setShowPrivateRequestModal}
        vendorId={vendor.id.toString()}
        vendorName={vendorInfo.name}
      />
    </Dialog>
  );
};
