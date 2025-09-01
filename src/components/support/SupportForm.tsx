import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchOptimizedButton } from "@/components/ui/TouchOptimizedButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Send, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SupportFormProps {
  onSubmit: (data: { subject: string; message: string; category: string; priority: string }) => Promise<void>;
  isRTL?: boolean;
  t: (key: string) => string;
}

export const SupportForm = ({ onSubmit, isRTL = false, t }: SupportFormProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: t('common.error'),
        description: t('forms.required'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        subject: subject.trim(),
        message: message.trim(),
        category,
        priority
      });
      
      // Clear form on success
      setSubject("");
      setMessage("");
      setCategory("general");
      setPriority("medium");
      
      toast({
        title: t('support.success.ticketCreated'),
        description: "We'll get back to you soon!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('support.errors.ticketFailed'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className={cn(
          "text-xl flex items-center gap-2",
          isRTL && "flex-row-reverse text-right"
        )}>
          <AlertCircle className="h-5 w-5 text-primary" />
          {t('support.createTicket')}
        </CardTitle>
        <CardDescription className={isRTL ? "text-right" : ""}>
          {t('support.createTicketDescription')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="subject"
              className={cn("text-sm font-medium", isRTL && "text-right block")}
            >
              {t('support.subjectPlaceholder')} *
            </Label>
            <Input
              id="subject"
              placeholder={t('support.subjectPlaceholder')}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className={cn(
                "h-11 min-h-[44px]", // Touch-friendly height
                isRTL && "text-right"
              )}
              aria-describedby="subject-error"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label 
              htmlFor="category"
              className={cn("text-sm font-medium", isRTL && "text-right block")}
            >
              {t('support.category.label')}
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t('support.category.general')}</SelectItem>
                <SelectItem value="technical">{t('support.category.technical')}</SelectItem>
                <SelectItem value="billing">{t('support.category.billing')}</SelectItem>
                <SelectItem value="account">{t('support.category.account')}</SelectItem>
                <SelectItem value="feature">{t('support.category.feature')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <Label 
              htmlFor="priority"
              className={cn("text-sm font-medium", isRTL && "text-right block")}
            >
              {t('support.priority.label')}
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-11 min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('support.priority.low')}</SelectItem>
                <SelectItem value="medium">{t('support.priority.medium')}</SelectItem>
                <SelectItem value="high">{t('support.priority.high')}</SelectItem>
                <SelectItem value="urgent">{t('support.priority.urgent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Message Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="message"
              className={cn("text-sm font-medium", isRTL && "text-right block")}
            >
              {t('support.messagePlaceholder')} *
            </Label>
            <Textarea
              id="message"
              placeholder={t('support.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className={cn(
                "min-h-[100px] resize-y",
                isRTL && "text-right"
              )}
              aria-describedby="message-error"
            />
          </div>
          
          {/* Submit Button */}
          <TouchOptimizedButton 
            type="submit" 
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "w-full gap-2 font-semibold",
              isRTL && "flex-row-reverse"
            )}
            aria-label={t('support.submitTicket')}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('support.submitTicket')}
              </>
            )}
          </TouchOptimizedButton>
        </form>
      </CardContent>
    </Card>
  );
};