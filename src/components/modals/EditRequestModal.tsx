import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRealTimeRequests, Request } from '@/hooks/useRealTimeRequests';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditRequestModalProps {
  request: Request;
  children: React.ReactNode;
}

export const EditRequestModal = ({ request, children }: EditRequestModalProps) => {
  const { updateRequest, deleteRequest } = useRealTimeRequests();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: request.title || '',
    description: request.description || '',
    category: request.category || '',
    budget_min: request.budget_min?.toString() || '',
    budget_max: request.budget_max?.toString() || '',
    location: request.location || '',
    deadline: request.deadline ? new Date(request.deadline) : undefined,
    urgency: request.urgency || 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  const CATEGORIES = [
    t('categories.constructionMaterials'),
    t('categories.itEquipment'),
    t('categories.officeSupplies'),
    t('categories.industrialEquipment'),
    t('categories.medicalEquipment'),
    t('categories.transportation'),
    t('categories.cateringServices'),
    t('categories.maintenanceServices'),
    t('categories.consultingServices'),
    t('categories.securityServices')
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: t('common.error'),
        description: t('modals.editRequest.validation.requiredFields'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await updateRequest(request.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
        location: formData.location || undefined,
        deadline: formData.deadline?.toISOString().split('T')[0] || undefined,
        urgency: formData.urgency
      });

      toast({
        title: t('common.success'),
        description: t('modals.editRequest.success.updated')
      });

      setOpen(false);
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: t('common.error'),
        description: t('modals.editRequest.errors.updateFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteRequest(request.id);

      toast({
        title: t('common.success'),
        description: t('modals.editRequest.success.deleted')
      });

      setOpen(false);
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: t('common.error'),
        description: t('modals.editRequest.errors.deleteFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('modals.editRequest.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <Label htmlFor="title">{t('modals.editRequest.labels.title')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={t('modals.editRequest.placeholders.title')}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t('modals.editRequest.labels.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder={t('modals.editRequest.placeholders.description')}
              className="min-h-32"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">{t('modals.editRequest.labels.category')}</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder={t('modals.editRequest.placeholders.category')} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget_min">{t('modals.editRequest.labels.budgetMin')}</Label>
              <Input
                id="budget_min"
                type="number"
                value={formData.budget_min}
                onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="budget_max">{t('modals.editRequest.labels.budgetMax')}</Label>
              <Input
                id="budget_max"
                type="number"
                value={formData.budget_max}
                onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">{t('modals.editRequest.labels.location')}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder={t('modals.editRequest.placeholders.location')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('modals.editRequest.labels.deadline')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : t('modals.editRequest.placeholders.deadline')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => setFormData({...formData, deadline: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="urgency">{t('modals.editRequest.labels.urgency')}</Label>
              <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData({...formData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('modals.editRequest.urgencyLevels.low')}</SelectItem>
                  <SelectItem value="medium">{t('modals.editRequest.urgencyLevels.medium')}</SelectItem>
                  <SelectItem value="high">{t('modals.editRequest.urgencyLevels.high')}</SelectItem>
                  <SelectItem value="urgent">{t('modals.editRequest.urgencyLevels.urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={loading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('modals.editRequest.deleteConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('modals.editRequest.deleteConfirmDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('modals.editRequest.cancelButton')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    {t('modals.editRequest.deleteButton')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex-1 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                {t('modals.editRequest.cancelButton')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 gap-2"
              >
                <Edit className="h-4 w-4" />
                {loading ? t('modals.editRequest.updating') : t('modals.editRequest.updateButton')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};