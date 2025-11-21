import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  created_at: string;
  request_id: string;
}

interface PDFQuoteGeneratorProps {
  offer: Offer;
  requestDetails?: {
    title: string;
    category: string;
    client_name?: string;
  };
}

interface QuoteBranding {
  company_name: string;
  company_logo?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  tax_id: string;
  payment_terms: string;
  terms_conditions: string;
  primary_color: string;
}

export const PDFQuoteGenerator = ({ offer, requestDetails }: PDFQuoteGeneratorProps) => {
  const { isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState<QuoteBranding>({
    company_name: userProfile?.company_name || '',
    address: '',
    phone: '',
    email: userProfile?.email || '',
    website: '',
    tax_id: '',
    payment_terms: 'Payment due within 30 days of invoice date',
    terms_conditions: 'This quote is valid for 30 days from the date of issue.',
    primary_color: '#2563eb',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Load saved branding from user profile
  useEffect(() => {
    const loadBranding = async () => {
      if (!userProfile?.id) return;

      const { data } = await supabase
        .from('vendor_branding')
        .select('*')
        .eq('vendor_id', userProfile.id)
        .single();

      if (data) {
        setBranding({
          company_name: data.company_name || branding.company_name,
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || branding.email,
          website: data.website || '',
          tax_id: data.tax_id || '',
          payment_terms: data.payment_terms || branding.payment_terms,
          terms_conditions: data.terms_conditions || branding.terms_conditions,
          primary_color: data.primary_color || branding.primary_color,
        });
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
      }
    };

    loadBranding();
  }, [userProfile?.id]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حجم الملف يجب أن يكون أقل من 2 ميجابايت' : 'File size must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase storage
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile?.id}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('vendor-logos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from('vendor-logos')
        .getPublicUrl(data.path);

      setBranding({ ...branding, company_logo: publicData.publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل رفع الشعار' : 'Failed to upload logo',
        variant: 'destructive',
      });
    }
  };

  const saveBranding = async () => {
    if (!userProfile?.id) return;

    try {
      const { error } = await supabase
        .from('vendor_branding')
        .upsert({
          vendor_id: userProfile.id,
          company_name: branding.company_name,
          logo_url: branding.company_logo,
          address: branding.address,
          phone: branding.phone,
          email: branding.email,
          website: branding.website,
          tax_id: branding.tax_id,
          payment_terms: branding.payment_terms,
          terms_conditions: branding.terms_conditions,
          primary_color: branding.primary_color,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ إعدادات العلامة التجارية' : 'Branding settings saved',
      });
    } catch (error) {
      console.error('Error saving branding:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل حفظ الإعدادات' : 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Convert hex color to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : { r: 37, g: 99, b: 235 }; // default blue
      };

      const primaryRgb = hexToRgb(branding.primary_color);

      // Header - Company Logo and Info
      if (logoPreview) {
        try {
          doc.addImage(logoPreview, 'PNG', 15, yPos, 30, 30);
        } catch (error) {
          console.log('Could not add logo to PDF');
        }
      }

      // Company Name
      doc.setFontSize(20);
      doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.text(branding.company_name, logoPreview ? 50 : 15, yPos + 10);

      // Company Details
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      yPos += 15;
      if (branding.address) doc.text(branding.address, logoPreview ? 50 : 15, yPos);
      yPos += 4;
      if (branding.phone) doc.text(`Tel: ${branding.phone}`, logoPreview ? 50 : 15, yPos);
      yPos += 4;
      if (branding.email) doc.text(`Email: ${branding.email}`, logoPreview ? 50 : 15, yPos);
      yPos += 4;
      if (branding.website) doc.text(`Web: ${branding.website}`, logoPreview ? 50 : 15, yPos);
      yPos += 4;
      if (branding.tax_id) doc.text(`Tax ID: ${branding.tax_id}`, logoPreview ? 50 : 15, yPos);

      // Quote Title
      yPos += 15;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('QUOTATION', pageWidth / 2, yPos, { align: 'center' });

      // Horizontal line
      yPos += 5;
      doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.setLineWidth(0.5);
      doc.line(15, yPos, pageWidth - 15, yPos);

      // Quote Details
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Quote ID: ${offer.id.slice(0, 8).toUpperCase()}`, 15, yPos);
      doc.text(`Date: ${new Date(offer.created_at).toLocaleDateString()}`, pageWidth - 15, yPos, { align: 'right' });

      yPos += 6;
      doc.text(`Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 15, yPos);

      // Client Information
      if (requestDetails?.client_name) {
        yPos += 10;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Client:', 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        yPos += 5;
        doc.text(requestDetails.client_name, 15, yPos);
      }

      // Request Details
      yPos += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Request Details:', 15, yPos);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPos += 5;
      if (requestDetails?.title) {
        doc.text(`Title: ${requestDetails.title}`, 15, yPos);
        yPos += 5;
      }
      if (requestDetails?.category) {
        doc.text(`Category: ${requestDetails.category}`, 15, yPos);
        yPos += 5;
      }

      // Offer Details
      yPos += 5;
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Our Proposal:', 15, yPos);
      yPos += 7;

      // Quote Items Table
      autoTable(doc, {
        startY: yPos,
        head: [['Item Description', 'Delivery Time', 'Unit Price', 'Amount']],
        body: [
          [
            offer.title,
            `${offer.delivery_time_days} days`,
            `${offer.price.toLocaleString()} ${offer.currency}`,
            `${offer.price.toLocaleString()} ${offer.currency}`,
          ],
        ],
        foot: [['', '', 'Total:', `${offer.price.toLocaleString()} ${offer.currency}`]],
        theme: 'striped',
        headStyles: {
          fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
        },
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: 'bold',
        },
        margin: { left: 15, right: 15 },
      });

      // Description
      yPos = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Description:', 15, yPos);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      yPos += 5;
      const splitDescription = doc.splitTextToSize(offer.description, pageWidth - 30);
      doc.text(splitDescription, 15, yPos);
      yPos += splitDescription.length * 4 + 5;

      // Payment Terms
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Payment Terms:', 15, yPos);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      yPos += 5;
      const splitPayment = doc.splitTextToSize(branding.payment_terms, pageWidth - 30);
      doc.text(splitPayment, 15, yPos);
      yPos += splitPayment.length * 4 + 5;

      // Terms & Conditions
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Terms & Conditions:', 15, yPos);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      yPos += 5;
      const splitTerms = doc.splitTextToSize(branding.terms_conditions, pageWidth - 30);
      doc.text(splitTerms, 15, yPos);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by MWRD Platform | ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Save PDF
      doc.save(`Quote_${offer.id.slice(0, 8)}_${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: isRTL ? 'تم إنشاء العرض' : 'Quote Generated',
        description: isRTL ? 'تم تنزيل ملف PDF' : 'PDF file downloaded',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل إنشاء ملف PDF' : 'Failed to generate PDF',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isRTL ? 'مولد عروض الأسعار PDF' : 'PDF Quote Generator'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Branding Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {isRTL ? 'معلومات الشركة' : 'Company Information'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">
                  {isRTL ? 'اسم الشركة' : 'Company Name'} *
                </Label>
                <Input
                  id="company_name"
                  value={branding.company_name}
                  onChange={(e) => setBranding({ ...branding, company_name: e.target.value })}
                  placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {isRTL ? 'الهاتف' : 'Phone'}
                </Label>
                <Input
                  id="phone"
                  value={branding.phone}
                  onChange={(e) => setBranding({ ...branding, phone: e.target.value })}
                  placeholder="+966 XX XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={branding.email}
                  onChange={(e) => setBranding({ ...branding, email: e.target.value })}
                  placeholder="company@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">
                  {isRTL ? 'الموقع الإلكتروني' : 'Website'}
                </Label>
                <Input
                  id="website"
                  value={branding.website}
                  onChange={(e) => setBranding({ ...branding, website: e.target.value })}
                  placeholder="www.company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">
                  {isRTL ? 'الرقم الضريبي' : 'Tax ID'}
                </Label>
                <Input
                  id="tax_id"
                  value={branding.tax_id}
                  onChange={(e) => setBranding({ ...branding, tax_id: e.target.value })}
                  placeholder={isRTL ? 'أدخل الرقم الضريبي' : 'Enter tax ID'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_color">
                  {isRTL ? 'اللون الأساسي' : 'Primary Color'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={branding.primary_color}
                    onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={branding.primary_color}
                    onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                {isRTL ? 'العنوان' : 'Address'}
              </Label>
              <Textarea
                id="address"
                value={branding.address}
                onChange={(e) => setBranding({ ...branding, address: e.target.value })}
                placeholder={isRTL ? 'أدخل عنوان الشركة' : 'Enter company address'}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">
                {isRTL ? 'شعار الشركة' : 'Company Logo'}
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-12 w-12 object-contain border rounded"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'الحد الأقصى: 2 ميجابايت' : 'Max size: 2MB'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_terms">
                {isRTL ? 'شروط الدفع' : 'Payment Terms'}
              </Label>
              <Textarea
                id="payment_terms"
                value={branding.payment_terms}
                onChange={(e) => setBranding({ ...branding, payment_terms: e.target.value })}
                placeholder={isRTL ? 'أدخل شروط الدفع' : 'Enter payment terms'}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms_conditions">
                {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Label>
              <Textarea
                id="terms_conditions"
                value={branding.terms_conditions}
                onChange={(e) => setBranding({ ...branding, terms_conditions: e.target.value })}
                placeholder={isRTL ? 'أدخل الشروط والأحكام' : 'Enter terms and conditions'}
                rows={3}
              />
            </div>

            <Button onClick={saveBranding} variant="outline" className="w-full">
              {isRTL ? 'حفظ إعدادات العلامة التجارية' : 'Save Branding Settings'}
            </Button>
          </div>

          {/* Generate PDF Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={generatePDF}
              disabled={loading || !branding.company_name}
              className="w-full gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isRTL ? 'جاري الإنشاء...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {isRTL ? 'إنشاء وتنزيل عرض السعر PDF' : 'Generate & Download PDF Quote'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
