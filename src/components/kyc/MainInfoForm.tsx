import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Mail, User, Building2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MainInfoFormData {
  firstName: string;
  lastName: string;
  designation: string;
  companyName: string;
  email: string;
  phoneNumber: string;
}

export const MainInfoForm = ({ onComplete }: { onComplete: () => void }) => {
  const [formData, setFormData] = useState<MainInfoFormData>({
    firstName: '',
    lastName: '',
    designation: '',
    companyName: '',
    email: '',
    phoneNumber: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!formData.phoneNumber.match(/^\+966[0-9]{9}$/)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Saudi phone number (+966XXXXXXXXX)",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: formData.phoneNumber }
      });

      if (error) throw error;
      
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "OTP sent to your phone. Valid for 5 minutes."
      });
      
      // DEV ONLY - show OTP in console
      if (data?.devOtp) {
        console.log('DEV OTP:', data.devOtp);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to send OTP',
        variant: "destructive"
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP code",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          phoneNumber: formData.phoneNumber,
          otpCode
        }
      });

      if (error) throw error;

      setPhoneVerified(true);
      toast({
        title: "Success",
        description: "Phone number verified successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || 'Failed to verify OTP',
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your phone number first",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.designation || 
        !formData.companyName || !formData.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Store data in session storage for use in KYC form
    sessionStorage.setItem('mainInfoData', JSON.stringify(formData));

    // Proceed to KYC form
    onComplete();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Main Information</CardTitle>
        <CardDescription>
          Please provide the focal contact person details for your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              <User className="w-4 h-4 inline mr-2" />
              First Name *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            placeholder="e.g., Procurement Manager, CEO, etc."
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            required
          />
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">
            <Building2 className="w-4 h-4 inline mr-2" />
            Company Name (as per CR) *
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        {/* Phone Verification */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number *
            </Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                placeholder="+966512345678"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                disabled={phoneVerified}
                required
              />
              {!phoneVerified && !otpSent && (
                <Button onClick={handleSendOTP} variant="outline">
                  Send OTP
                </Button>
              )}
              {phoneVerified && (
                <Button variant="outline" disabled>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </Button>
              )}
            </div>
          </div>

          {otpSent && !phoneVerified && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p>Enter the 6-digit code sent to your phone:</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={handleVerifyOTP} disabled={verifying}>
                      {verifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  <Button variant="link" size="sm" onClick={handleSendOTP}>
                    Resend OTP
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          size="lg"
          disabled={!phoneVerified}
        >
          Continue to KYC Form
        </Button>
      </CardContent>
    </Card>
  );
};
