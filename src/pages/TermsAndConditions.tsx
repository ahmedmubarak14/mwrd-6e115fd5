import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackToTop } from "@/components/ui/BackToTop";

export const TermsAndConditions = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('termsTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('termsLastUpdated')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('termsAcceptanceTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsAcceptanceContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsServicesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('termsServicesContent')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('termsServicesItem1')}</li>
                <li>{t('termsServicesItem2')}</li>
                <li>{t('termsServicesItem3')}</li>
                <li>{t('termsServicesItem4')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsAccountTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('termsAccountContent')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('termsAccountItem1')}</li>
                <li>{t('termsAccountItem2')}</li>
                <li>{t('termsAccountItem3')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsPaymentTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsPaymentContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsProhibitedTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed mb-4">{t('termsProhibitedContent')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('termsProhibitedItem1')}</li>
                <li>{t('termsProhibitedItem2')}</li>
                <li>{t('termsProhibitedItem3')}</li>
                <li>{t('termsProhibitedItem4')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsIntellectualTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsIntellectualContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsTerminationTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsTerminationContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsLimitationTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsLimitationContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsGoverningTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsGoverningContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsChangesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('termsChangesContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsContactTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="leading-relaxed">
                <p>{t('termsContactContent')}</p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-semibold">MWRD</p>
                  <p>Email: support@mwrd.sa</p>
                  <p>Phone: +966 11 XXX XXXX</p>
                  <p>{t('termsContactAddress')}</p>
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