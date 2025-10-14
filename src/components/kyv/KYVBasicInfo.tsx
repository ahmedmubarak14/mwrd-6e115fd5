import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KYVBasicInfoProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (field: string, file: File) => void;
}

export const KYVBasicInfo: React.FC<KYVBasicInfoProps> = ({
  formData,
  onChange,
  onFileUpload,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Business Information</CardTitle>
        <CardDescription>
          Provide additional details about your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tradeName">Trade Name (if different from legal name)</Label>
          <Input
            id="tradeName"
            value={formData.tradeName || ''}
            onChange={(e) => onChange('tradeName', e.target.value)}
            placeholder="Enter your trade name"
          />
          <p className="text-xs text-muted-foreground">
            The name under which you conduct business, if different from legal name
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
          <Select value={formData.numberOfEmployees} onValueChange={(v) => onChange('numberOfEmployees', v)}>
            <SelectTrigger id="numberOfEmployees">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-100">51-100 employees</SelectItem>
              <SelectItem value="101-250">101-250 employees</SelectItem>
              <SelectItem value="251-500">251-500 employees</SelectItem>
              <SelectItem value="500+">500+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zakatCert">Zakat Certificate (PDF)</Label>
          <Input
            id="zakatCert"
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileUpload('zakatCertificate', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload your Zakat, Tax and Customs Authority certificate
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chamberCert">Chamber of Commerce Certificate (PDF)</Label>
          <Input
            id="chamberCert"
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileUpload('chamberCommerceCertificate', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload your Chamber of Commerce membership certificate
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLogo">Company Logo (Image)</Label>
          <Input
            id="companyLogo"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFileUpload('companyLogo', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload your official company logo (PNG, JPG, or SVG)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
