
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchOptimizedButton } from "@/components/ui/TouchOptimizedButton";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePerformantSupportTickets } from "@/hooks/usePerformantSupportTickets";
import { useAccessibleAnnouncements } from "@/hooks/useAccessibleAnnouncements";
import { AccessibleLoadingSpinner } from "@/components/ui/AccessibleLoadingSpinner";
import { LiveChatButton } from "@/components/support/LiveChatButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyTicketsState } from "@/components/support/EmptyTicketsState";
import { SupportForm } from "@/components/support/SupportForm";
import { HelpCircle, MessageSquare, Phone, Mail, Ticket, CheckCircle, Clock, AlertCircle } from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

const SupportContent = React.memo(() => {
  const { userProfile } = useAuth();
  const { t, isRTL, formatDate } = useLanguage();
  const { tickets, loading, createTicket, ticketMetrics } = usePerformantSupportTickets();
  const { announce, announceLoading, announceSuccess, announceError } = useAccessibleAnnouncements();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Announce page load to screen readers
  useEffect(() => {
    announce(t('support.title'), 'polite');
    announceLoading(loading, 'support tickets');
  }, [announce, announceLoading, loading, t]);

  // Memoize metrics to prevent unnecessary recalculations
  const metrics = useMemo(() => ticketMetrics, [ticketMetrics]);

  const handleSubmitTicket = useCallback(async (data: { subject: string; message: string; category: string; priority: string }) => {
    try {
      await createTicket({
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        message: data.message
      });
      setShowCreateForm(false);
      announceSuccess(t('support.success.ticketCreated'));
    } catch (error) {
      console.error('Error creating support ticket:', error);
      announceError(t('support.errors.ticketFailed'));
      throw error; // Re-throw to be handled by SupportForm
    }
  }, [createTicket, announceSuccess, announceError, t]);

  const handleShowCreateForm = useCallback(() => {
    setShowCreateForm(true);
    announce(t('support.createTicket'), 'polite');
  }, [announce, t]);

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        role="main"
        aria-label={t('support.title')}
      >
        <AccessibleLoadingSpinner 
          size="lg"
          label={t('common.loading')}
          description="Loading support tickets and information"
        />
      </div>
    );
  }

  return (
    <main 
      id="main-content"
      className={cn("space-y-6", isRTL && "rtl")} 
      dir={isRTL ? 'rtl' : 'ltr'}
      role="main"
      aria-label={t('support.title')}
    >
      
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
        <section 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
          aria-label="Support ticket statistics"
        >
          <MetricCard
            title={t('support.totalTickets')}
            value={metrics.total}
            icon={Ticket}
            aria-label={`${metrics.total} ${t('support.totalTickets')}`}
          />
          <MetricCard
            title={t('support.openTickets')}
            value={metrics.open}
            icon={AlertCircle}
            variant="warning"
            aria-label={`${metrics.open} ${t('support.openTickets')}`}
          />
          <MetricCard
            title={t('support.pending')}
            value={metrics.pending}
            icon={Clock}
            variant="warning"
            aria-label={`${metrics.pending} ${t('support.pending')}`}
          />
          <MetricCard
            title={t('support.resolved')}
            value={metrics.resolved}
            icon={CheckCircle}
            variant="success"
            aria-label={`${metrics.resolved} ${t('support.resolved')}`}
          />
        </section>
      )}

      <section 
        className="grid gap-6 lg:grid-cols-2"
        aria-label="Support contact options and ticket creation"
      >
        {/* Contact Methods */}
        <Card className="h-fit">
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
              "flex items-center gap-3 p-4 bg-muted/30 rounded-lg transition-colors hover:bg-muted/50",
              isRTL && "flex-row-reverse"
            )}>
              <MessageSquare className="h-5 w-5 text-info" />
              <div className={cn("flex-1", isRTL && "text-right")}>
                <p className="font-medium">{t('support.liveChat')}</p>
                <p className="text-sm text-muted-foreground">{t('support.liveChatHours')}</p>
              </div>
            </div>
            
            <div className="mt-2">
              <LiveChatButton />
            </div>
            
            <div className={cn(
              "flex items-center gap-3 p-4 bg-muted/30 rounded-lg transition-colors hover:bg-muted/50",
              isRTL && "flex-row-reverse"
            )}>
              <Phone className="h-5 w-5 text-success" />
              <div className={isRTL ? "text-right" : ""}>
                <p className="font-medium">{t('support.phone')}</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className={cn(
              "flex items-center gap-3 p-4 bg-muted/30 rounded-lg transition-colors hover:bg-muted/50",
              isRTL && "flex-row-reverse"
            )}>
              <Mail className="h-5 w-5 text-warning" />
              <div className={isRTL ? "text-right" : ""}>
                <p className="font-medium">{t('support.email')}</p>
                <p className="text-sm text-muted-foreground">support@mwrd.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Ticket Form or Show Form Button */}
        {showCreateForm ? (
          <SupportForm 
            onSubmit={handleSubmitTicket}
            isRTL={isRTL}
            t={t}
          />
        ) : (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {t('support.createTicket')}
              </CardTitle>
              <CardDescription className={isRTL ? "text-right" : ""}>
                {t('support.createTicketDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TouchOptimizedButton 
                onClick={handleShowCreateForm}
                size="lg"
                className={cn(
                  "w-full gap-2 font-semibold",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Ticket className="h-4 w-4" />
                {t('support.createTicket')}
              </TouchOptimizedButton>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent Tickets or Empty State */}
      <section aria-label="Support tickets">
        {tickets && tickets.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {t('support.recentTickets')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="space-y-3"
                role="list"
                aria-label="Recent support tickets"
              >
                {tickets.slice(0, 5).map((ticket, index) => (
                  <div 
                    key={ticket.id}
                    role="listitem"
                    tabIndex={0}
                    className={cn(
                      "flex justify-between items-start p-4 bg-muted/30 rounded-lg border border-border/50 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      isRTL && "flex-row-reverse"
                    )}
                    aria-label={`Support ticket: ${ticket.subject}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Could navigate to ticket detail here
                      }
                    }}
                  >
                    <div className={cn("flex-1", isRTL ? "text-right" : "")}>
                      <p className="font-medium text-foreground mb-1">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(ticket.created_at))}
                      </p>
                    </div>
                    <div className={cn(
                      "flex flex-col gap-1 ml-4",
                      isRTL ? "text-left ml-0 mr-4" : "text-right"
                    )}>
                      <span 
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          ticket.status === 'open' ? "bg-warning/20 text-warning" :
                          ticket.status === 'closed' ? "bg-success/20 text-success" :
                          "bg-info/20 text-info"
                        )}
                        aria-label={`Status: ${t(`support.status.${ticket.status}`)}`}
                      >
                        {t(`support.status.${ticket.status}`)}
                      </span>
                      <span 
                        className="text-xs text-muted-foreground capitalize"
                        aria-label={`Priority: ${t(`support.priority.${ticket.priority}`)}`}
                      >
                        {t(`support.priority.${ticket.priority}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !loading && !showCreateForm && (
          <EmptyTicketsState 
            onCreateTicket={handleShowCreateForm}
            isRTL={isRTL}
            t={t}
          />
        )}
      </section>
    </main>
  );
});

SupportContent.displayName = "SupportContent";

export const Support = React.memo(() => {
  return (
    <div className="relative">
      <SkipToContent targetId="main-content" />
      <ErrorBoundary>
        <SupportContent />
      </ErrorBoundary>
    </div>
  );
});

Support.displayName = "Support";

export default Support;
