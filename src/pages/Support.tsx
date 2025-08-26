
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { HelpCircle, MessageSquare, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";

export const Support = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const { tickets, loading, createTicket } = useSupportTickets();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await createTicket({
        subject: subject.trim(),
        message: message.trim(),
        priority: 'medium'
      });
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error('Error creating support ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CleanDashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CleanDashboardLayout>
    );
  }

  return (
    <CleanDashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('support.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('support.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t('support.contactUs')}
              </CardTitle>
              <CardDescription>
                {t('support.contactDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{t('support.liveChat')}</p>
                  <p className="text-sm text-muted-foreground">{t('support.liveChatHours')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">{t('support.phone')}</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">{t('support.email')}</p>
                  <p className="text-sm text-muted-foreground">support@mwrd.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Ticket */}
          <Card>
            <CardHeader>
              <CardTitle>{t('support.createTicket')}</CardTitle>
              <CardDescription>
                {t('support.createTicketDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <Input
                    placeholder={t('support.subjectPlaceholder')}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder={t('support.messagePlaceholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('support.submitTicket')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets */}
        {tickets && tickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('support.recentTickets')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium capitalize">{ticket.status}</p>
                      <p className="text-sm text-muted-foreground capitalize">{ticket.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CleanDashboardLayout>
  );
};

export default Support;
