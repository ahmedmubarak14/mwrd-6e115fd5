import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('kyvForms.basicInfo.title')}</CardTitle>
        <CardDescription>
          {t('kyvForms.basicInfo.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tradeName">{t('kyvForms.basicInfo.labels.tradeName')}</Label>
          <Input
            id="tradeName"
            value={formData.tradeName || ''}
            onChange={(e) => onChange('tradeName', e.target.value)}
            placeholder={t('kyvForms.basicInfo.placeholders.tradeName')}
          />
          <p className="text-xs text-muted-foreground">
            {t('kyvForms.basicInfo.helpText.tradeName')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfEmployees">{t('kyvForms.basicInfo.labels.numberOfEmployees')}</Label>
          <Select value={formData.numberOfEmployees} onValueChange={(v) => onChange('numberOfEmployees', v)}>
            <SelectTrigger id="numberOfEmployees">
              <SelectValue placeholder={t('kyvForms.basicInfo.placeholders.companySize')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">{t('kyvForms.basicInfo.companySizes.small')}</SelectItem>
              <SelectItem value="11-50">{t('kyvForms.basicInfo.companySizes.small_medium')}</SelectItem>
              <SelectItem value="51-100">{t('kyvForms.basicInfo.companySizes.medium')}</SelectItem>
              <SelectItem value="101-250">{t('kyvForms.basicInfo.companySizes.medium_large')}</SelectItem>
              <SelectItem value="251-500">{t('kyvForms.basicInfo.companySizes.large')}</SelectItem>
              <SelectItem value="500+">{t('kyvForms.basicInfo.companySizes.xlarge')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zakatCert">{t('kyvForms.basicInfo.labels.zakatCertificate')}</Label>
          <Input
            id="zakatCert"
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileUpload('zakatCertificate', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            {t('kyvForms.basicInfo.helpText.zakat')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chamberCert">{t('kyvForms.basicInfo.labels.chamberCertificate')}</Label>
          <Input
            id="chamberCert"
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileUpload('chamberCommerceCertificate', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            {t('kyvForms.basicInfo.helpText.chamber')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLogo">{t('kyvForms.basicInfo.labels.companyLogo')}</Label>
          <Input
            id="companyLogo"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFileUpload('companyLogo', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            {t('kyvForms.basicInfo.helpText.logo')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
