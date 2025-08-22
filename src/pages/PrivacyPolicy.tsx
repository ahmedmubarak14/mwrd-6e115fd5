import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackToTop } from "@/components/ui/BackToTop";

export const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('privacyTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('privacyLastUpdated')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('privacyIntroTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('privacyIntroContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyCollectionTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('privacyCollectionContent')}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('privacyPersonalInfoTitle')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{t('privacyPersonalInfoItem1')}</li>
                    <li>{t('privacyPersonalInfoItem2')}</li>
                    <li>{t('privacyPersonalInfoItem3')}</li>
                    <li>{t('privacyPersonalInfoItem4')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('privacyBusinessInfoTitle')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{t('privacyBusinessInfoItem1')}</li>
                    <li>{t('privacyBusinessInfoItem2')}</li>
                    <li>{t('privacyBusinessInfoItem3')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('privacyTechnicalInfoTitle')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{t('privacyTechnicalInfoItem1')}</li>
                    <li>{t('privacyTechnicalInfoItem2')}</li>
                    <li>{t('privacyTechnicalInfoItem3')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyUsageTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('privacyUsageContent')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacyUsageItem1')}</li>
                <li>{t('privacyUsageItem2')}</li>
                <li>{t('privacyUsageItem3')}</li>
                <li>{t('privacyUsageItem4')}</li>
                <li>{t('privacyUsageItem5')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacySharingTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('privacySharingContent')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacySharingItem1')}</li>
                <li>{t('privacySharingItem2')}</li>
                <li>{t('privacySharingItem3')}</li>
                <li>{t('privacySharingItem4')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacySecurityTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('privacySecurityContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyRetentionTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('privacyRetentionContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyRightsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('privacyRightsContent')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacyRightsItem1')}</li>
                <li>{t('privacyRightsItem2')}</li>
                <li>{t('privacyRightsItem3')}</li>
                <li>{t('privacyRightsItem4')}</li>
                <li>{t('privacyRightsItem5')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyCookiesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('privacyCookiesContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyChangesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('privacyChangesContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacyContactTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="leading-relaxed">
                <p>{t('privacyContactContent')}</p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-semibold">MWRD - Data Protection Officer</p>
                  <p>Email: privacy@mwrd.sa</p>
                  <p>Phone: +966 11 XXX XXXX</p>
                  <p>{t('privacyContactAddress')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};