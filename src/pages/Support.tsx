
import { VendorBreadcrumbs } from "@/components/vendor/VendorBreadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const SupportContent = React.memo(() => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { tickets, loading, createTicket } = useSupportTickets();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, isRTL, formatDate } = languageContext || { 
    t: (key: string) => key.split('.').pop() || key,
    isRTL: false,
    formatDate: (date: Date) => date.toLocaleDateString()
  };
  
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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>
      <VendorBreadcrumbs />
      
      <div className="mb-8">
        <h1 className={cn(
          "text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight",
          isRTL && "text-right"
        )}>
          {t('support.title')}
        </h1>
        <p className={cn(
          "text-foreground opacity-75 text-sm sm:text-base max-w-2xl",
          isRTL && "text-right"
        )}>
          {t('support.subtitle')}
        </p>
      </div>
      {/* Support Metrics */}
      {tickets && tickets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('support.totalTickets')}
            value={metrics.total}
            icon={Ticket}
          />
          <MetricCard
            title={t('support.openTickets')}
            value={metrics.open}
            icon={AlertCircle}
            variant="warning"
          />
          <MetricCard
            title={t('support.pending')}
            value={metrics.pending}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title={t('support.resolved')}
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
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse text-right"
              )}>
                <HelpCircle className="h-5 w-5" />
                {t('support.contactUs')}
              </CardTitle>
              <CardDescription className={isRTL ? "text-right" : ""}>
                {t('support.contactDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn(
                "flex items-center gap-3 p-3 bg-muted/50 rounded-lg",
                isRTL && "flex-row-reverse"
              )}>
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div className={cn("flex-1", isRTL && "text-right")}>
                  <p className="font-medium">{t('support.liveChat')}</p>
                  <p className="text-sm text-muted-foreground">{t('support.liveChatHours')}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <LiveChatButton />
              </div>
              
              <div className={cn(
                "flex items-center gap-3 p-3 bg-muted/50 rounded-lg",
                isRTL && "flex-row-reverse"
              )}>
                <Phone className="h-5 w-5 text-green-500" />
                <div className={isRTL ? "text-right" : ""}>
                  <p className="font-medium">{t('support.phone')}</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center gap-3 p-3 bg-muted/50 rounded-lg",
                isRTL && "flex-row-reverse"
              )}>
                <Mail className="h-5 w-5 text-orange-500" />
                <div className={isRTL ? "text-right" : ""}>
                  <p className="font-medium">{t('support.email')}</p>
                  <p className="text-sm text-muted-foreground">support@mwrd.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {t('support.createTicket')}
              </CardTitle>
              <CardDescription className={isRTL ? "text-right" : ""}>
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
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder={t('support.messagePlaceholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={cn(
                    "w-full gap-2",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
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
              <CardTitle className={isRTL ? "text-right" : ""}>
                {t('support.recentTickets')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className={cn(
                      "flex justify-between items-center p-3 bg-muted/50 rounded-lg",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <div className={isRTL ? "text-right" : ""}>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(ticket.created_at))}
                      </p>
                    </div>
                    <div className={isRTL ? "text-left" : "text-right"}>
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
  );
});

SupportContent.displayName = "SupportContent";

export const Support = React.memo(() => {
  return (
    <ErrorBoundary>
      <SupportContent />
    </ErrorBoundary>
  );
});

Support.displayName = "Support";

export default Support;
