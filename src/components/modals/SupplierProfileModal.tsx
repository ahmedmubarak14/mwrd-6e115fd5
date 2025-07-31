import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  MessageCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SupplierProfileModalProps {
  children: React.ReactNode;
  supplier: {
    id: number;
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
  };
}

export const SupplierProfileModal = ({ children, supplier }: SupplierProfileModalProps) => {
  const { t } = useLanguage();
  const isArabic = t('language') === 'ar';

  const supplierInfo = {
    name: isArabic ? supplier.name : supplier.englishName,
    category: isArabic ? supplier.category : supplier.englishCategory,
    location: isArabic ? supplier.location : supplier.englishLocation,
    description: isArabic ? supplier.description : supplier.englishDescription,
    responseTime: isArabic ? supplier.responseTime : supplier.englishResponseTime
  };

  const portfolioItems = [
    { title: "Corporate Summit 2024", category: "Conference", image: "CS" },
    { title: "Tech Exhibition", category: "Trade Show", image: "TE" },
    { title: "Product Launch Event", category: "Launch", image: "PL" },
    { title: "Annual Gala", category: "Gala", image: "AG" }
  ];

  const services = [
    "Audio Equipment Setup",
    "Video Production",
    "Stage Lighting",
    "Event Photography",
    "Live Streaming",
    "Technical Support"
  ];

  const certifications = [
    "ISO 9001:2015 Certified",
    "Event Management Professional",
    "Audio-Visual Technology Specialist"
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                {supplierInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{supplierInfo.name}</DialogTitle>
              <DialogDescription className="text-lg text-primary font-medium">
                {supplierInfo.category}
              </DialogDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{supplier.rating}</span>
                  <span className="text-muted-foreground">({supplier.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{supplierInfo.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-gradient-to-r from-primary to-accent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Now
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{supplier.completedProjects}+</div>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="font-bold text-accent">{supplierInfo.responseTime}</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              </CardContent>
            </Card>
          </div>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{supplierInfo.description}</p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
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
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Some of our latest work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolioItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{item.image}</span>
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
                Certifications & Awards
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

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>contact@{supplierInfo.name.toLowerCase().replace(/\s+/g, '')}.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.{supplierInfo.name.toLowerCase().replace(/\s+/g, '')}.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};