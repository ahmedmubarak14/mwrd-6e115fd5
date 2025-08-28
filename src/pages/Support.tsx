
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LiveChatButton } from "@/components/support/LiveChatButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { HelpCircle, MessageSquare, Phone, Mail, Send, Ticket, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";

export const Support = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { tickets, loading, createTicket } = useSupportTickets();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safe fallback for translation
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);
  
  // Support metrics
  const metrics = useMemo(() => {
    if (!tickets) return { total: 0, open: 0, closed: 0, pending: 0 };
    
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      pending: tickets.filter(t => t.status === 'pending').length,
    };
  }, [tickets]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await createTicket({
        subject: subject.trim(),
        category: 'general',
        priority: 'medium',
        message: message.trim()
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
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer
      title={t('support.title') || 'Support'}
      description={t('support.subtitle') || 'Get help from our support team'}
    >
      {/* Support Metrics */}
      {tickets && tickets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Tickets"
            value={metrics.total}
            icon={Ticket}
          />
          <MetricCard
            title="Open Tickets"
            value={metrics.open}
            icon={AlertCircle}
            variant="warning"
          />
          <MetricCard
            title="Pending"
            value={metrics.pending}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title="Resolved"
            value={metrics.closed}
            icon={CheckCircle}
            variant="success"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t('support.contactUs') || 'Contact Us'}
              </CardTitle>
              <CardDescription>
                {t('support.contactDescription') || 'Choose how you\'d like to get in touch'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">{t('support.liveChat') || 'Live Chat'}</p>
                  <p className="text-sm text-muted-foreground">{t('support.liveChatHours') || 'Available 24/7'}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <LiveChatButton />
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">{t('support.phone') || 'Phone'}</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">{t('support.email') || 'Email'}</p>
                  <p className="text-sm text-muted-foreground">support@mwrd.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Ticket */}
          <Card>
            <CardHeader>
              <CardTitle>{t('support.createTicket') || 'Create Support Ticket'}</CardTitle>
              <CardDescription>
                {t('support.createTicketDescription') || 'Submit a detailed support request'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <Input
                    placeholder={t('support.subjectPlaceholder') || 'Subject'}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder={t('support.messagePlaceholder') || 'Describe your issue...'}
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
                      {t('support.submitTicket') || 'Submit Ticket'}
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
              <CardTitle>{t('support.recentTickets') || 'Recent Support Tickets'}</CardTitle>
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
    </ClientPageContainer>
  );
};

export default Support;
