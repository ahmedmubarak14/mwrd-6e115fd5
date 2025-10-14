import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface KYVDeclarationProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (field: string, file: File) => void;
}

export const KYVDeclaration: React.FC<KYVDeclarationProps> = ({
  formData,
  onChange,
  onFileUpload,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Declaration</CardTitle>
        <CardDescription>
          Confirm the accuracy of all provided information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Declaration Statement:</strong>
            <br />
            I, the undersigned, confirm that all information provided in this vendor verification form is true, complete, and accurate to the best of my knowledge. I understand that:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Providing false or misleading information may result in immediate disqualification from the vendor program</li>
              <li>NGS reserves the right to verify all submitted information and documents</li>
              <li>Any changes to the information provided must be communicated immediately</li>
              <li>Acceptance as a vendor is subject to NGS approval and ongoing compliance</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="signature">Authorized Signature (Upload signed document) *</Label>
          <Input
            id="signature"
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => e.target.files?.[0] && onFileUpload('vendorSignature', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload a document with the authorized signatory's signature
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyStamp">Company Stamp (Image) *</Label>
          <Input
            id="companyStamp"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFileUpload('companyStamp', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload a clear image of your official company stamp
          </p>
        </div>

        <div className="flex items-start space-x-2 p-4 bg-muted rounded-lg">
          <Checkbox
            id="declaration"
            checked={formData.declarationAccepted || false}
            onCheckedChange={(checked) => onChange('declarationAccepted', checked)}
          />
          <label htmlFor="declaration" className="text-sm leading-tight cursor-pointer">
            <strong>I hereby declare that:</strong> All information provided in this form is true and accurate. I accept the terms and conditions outlined above and authorize NGS to verify the information submitted. *
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
