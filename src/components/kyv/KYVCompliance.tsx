import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface KYVComplianceProps {
  onFileUpload: (field: string, files: File[]) => void;
}

export const KYVCompliance: React.FC<KYVComplianceProps> = ({ onFileUpload }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance & Certification</CardTitle>
        <CardDescription>
          Upload quality, safety, and regulatory certificates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="qualityCerts">Quality Certificates (ISO/SASO/GSO)</Label>
          <Input
            id="qualityCerts"
            type="file"
            accept="application/pdf,image/*"
            multiple
            onChange={(e) => onFileUpload('qualityCertificates', Array.from(e.target.files || []))}
          />
          <p className="text-xs text-muted-foreground">
            Upload ISO 9001, SASO, GSO or other quality certifications (multiple files allowed)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="safetyCerts">Product Safety / Halal Certificates</Label>
          <Input
            id="safetyCerts"
            type="file"
            accept="application/pdf,image/*"
            multiple
            onChange={(e) => onFileUpload('safetyCertificates', Array.from(e.target.files || []))}
          />
          <p className="text-xs text-muted-foreground">
            Upload product safety certifications, Halal certificates, or compliance documents
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceLicenses">Insurance / GOSI / Municipal License</Label>
          <Input
            id="insuranceLicenses"
            type="file"
            accept="application/pdf,image/*"
            multiple
            onChange={(e) => onFileUpload('insuranceLicenses', Array.from(e.target.files || []))}
          />
          <p className="text-xs text-muted-foreground">
            Upload business insurance, GOSI registration, municipal license, or trade permits
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
