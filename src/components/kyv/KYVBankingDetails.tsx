import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KYVBankingDetailsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (field: string, file: File) => void;
}

export const KYVBankingDetails: React.FC<KYVBankingDetailsProps> = ({
  formData,
  onChange,
  onFileUpload,
}) => {
  const saudiBanks = [
    { value: 'NCB', label: 'National Commercial Bank (Al Ahli)' },
    { value: 'Rajhi', label: 'Al Rajhi Bank' },
    { value: 'Riyad', label: 'Riyad Bank' },
    { value: 'SABB', label: 'SABB (Saudi British Bank)' },
    { value: 'Alinma', label: 'Alinma Bank' },
    { value: 'Albilad', label: 'Bank Albilad' },
    { value: 'Aljazira', label: 'Bank Aljazira' },
    { value: 'ANB', label: 'Arab National Bank' },
    { value: 'BSF', label: 'Banque Saudi Fransi' },
    { value: 'SAMBA', label: 'Samba Financial Group' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banking Details</CardTitle>
        <CardDescription>
          Provide your banking information for payment processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name *</Label>
          <Select value={formData.bankName} onValueChange={(v) => onChange('bankName', v)}>
            <SelectTrigger id="bankName">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              {saudiBanks.map((bank) => (
                <SelectItem key={bank.value} value={bank.value}>
                  {bank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountHolderName">Account Holder Name *</Label>
          <Input
            id="accountHolderName"
            value={formData.accountHolderName || ''}
            onChange={(e) => onChange('accountHolderName', e.target.value)}
            placeholder="As shown in bank records"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ibanNumber">IBAN Number *</Label>
          <Input
            id="ibanNumber"
            value={formData.ibanNumber || ''}
            onChange={(e) => onChange('ibanNumber', e.target.value.replace(/[^A-Z0-9]/g, '').toUpperCase())}
            placeholder="SA0000000000000000000000"
            maxLength={24}
          />
          <p className="text-xs text-muted-foreground">
            Enter your 24-character IBAN starting with SA
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankBranch">Bank Branch (Optional)</Label>
          <Input
            id="bankBranch"
            value={formData.bankBranch || ''}
            onChange={(e) => onChange('bankBranch', e.target.value)}
            placeholder="Branch name or code"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankConfirmation">Bank Confirmation Letter (PDF) *</Label>
          <Input
            id="bankConfirmation"
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileUpload('bankConfirmationLetter', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload an official letter from your bank confirming account details
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
