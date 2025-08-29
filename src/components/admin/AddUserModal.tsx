import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onUserAdded
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    companyName: '',
    role: 'client' as 'client' | 'vendor' | 'admin'
  });

  const { showSuccess, showError } = useToastFeedback();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName) {
      showError(t('admin.users.fillRequiredFields') || 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Create user profile directly (in real implementation, you'd create auth user first)  
      // For demo purposes, we'll use a generated UUID as user_id
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: crypto.randomUUID(),
          id: crypto.randomUUID(), // Add required id field
          email: formData.email,
          full_name: formData.fullName,
          company_name: formData.companyName || null,
          role: formData.role,
        });

      if (profileError) throw profileError;

      showSuccess(t('admin.users.userAddedSuccess') || 'User added successfully');
      onUserAdded();
      handleClose();
    } catch (error: any) {
      showError(error.message || t('admin.users.addUserError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      fullName: '',
      companyName: '',
      role: 'client'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("sm:max-w-md", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={cn(isRTL ? "text-right" : "text-left")}>
            {t('admin.users.addUser')}
          </DialogTitle>
          <DialogDescription className={cn(isRTL ? "text-right" : "text-left")}>
            {t('admin.users.addUserDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={cn(isRTL ? "text-right" : "text-left")}>
              {t('common.email')} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder={t('common.email')}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className={cn(isRTL ? "text-right" : "text-left")}>
              {t('user.fullName')} *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder={t('user.fullName')}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className={cn(isRTL ? "text-right" : "text-left")}>
              {t('user.companyName')}
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder={t('user.companyName')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className={cn(isRTL ? "text-right" : "text-left")}>
              {t('admin.users.role')} *
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'client' | 'vendor' | 'admin') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.users.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">{t('admin.users.client')}</SelectItem>
                <SelectItem value="vendor">{t('admin.users.vendor')}</SelectItem>
                <SelectItem value="admin">{t('admin.users.admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className={cn("gap-2", isRTL && "flex-row-reverse")}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              {t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};