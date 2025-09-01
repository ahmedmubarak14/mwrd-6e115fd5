
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchOptimizedButton } from "@/components/ui/TouchOptimizedButton";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LiveChatButton } from "@/components/support/LiveChatButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyTicketsState } from "@/components/support/EmptyTicketsState";
import { SupportForm } from "@/components/support/SupportForm";
import { HelpCircle, MessageSquare, Phone, Mail, Ticket, CheckCircle, Clock, AlertCircle } from "lucide-react";
import React, { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

const SupportContent = React.memo(() => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { tickets, loading, createTicket } = useSupportTickets();
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleSubmitTicket = useCallback(async (data: { subject: string; message: string; category: string; priority: string }) => {
    try {
      await createTicket({
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        message: data.message
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error; // Re-throw to be handled by SupportForm
    }
  }, [createTicket]);

  const handleShowCreateForm = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>
      
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

      <div className="grid gap-6 lg:grid-cols-2">
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
      </div>

      {/* Recent Tickets or Empty State */}
      {tickets && tickets.length > 0 ? (
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
                    "flex justify-between items-start p-4 bg-muted/30 rounded-lg border border-border/50 transition-colors hover:bg-muted/50",
                    isRTL && "flex-row-reverse"
                  )}
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
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      ticket.status === 'open' ? "bg-warning/20 text-warning" :
                      ticket.status === 'closed' ? "bg-success/20 text-success" :
                      "bg-info/20 text-info"
                    )}>
                      {t(`support.status.${ticket.status}`)}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
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
