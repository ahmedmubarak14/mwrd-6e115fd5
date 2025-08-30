import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Download, UserCog, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { UserProfile } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

interface BulkUserActionsProps {
  users: UserProfile[];
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  onUsersUpdated: () => void;
}

export const BulkUserActions = ({ 
  users, 
  selectedUsers, 
  onSelectionChange, 
  onUsersUpdated 
}: BulkUserActionsProps) => {
  const [bulkRole, setBulkRole] = useState<string>("");
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map(user => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUsers, userId]);
    } else {
      onSelectionChange(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkRoleUpdate = async () => {
    if (!bulkRole || selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: bulkRole as 'admin' | 'client' | 'vendor' })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: `Updated role for ${selectedUsers.length} users`,
      });

      onUsersUpdated();
      onSelectionChange([]);
      setBulkRole("");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.updateError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: bulkStatus as any })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: `Updated status for ${selectedUsers.length} users`,
      });

      onUsersUpdated();
      onSelectionChange([]);
      setBulkStatus("");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.updateError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = () => {
    const exportData = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        company_name: user.company_name,
        role: user.role,
        status: user.status,
        verification_status: user.verification_status,
        created_at: user.created_at,
      }));

    const csvContent = [
      ['ID', 'Email', 'Full Name', 'Company', 'Role', 'Status', 'Verification', 'Created'],
      ...exportData.map(user => [
        user.id,
        user.email,
        user.full_name || '',
        user.company_name || '',
        user.role,
        user.status,
        user.verification_status || '',
        user.created_at,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t('common.success'),
      description: `Exported ${selectedUsers.length} users`,
    });
  };

  const selectedCount = selectedUsers.length;
  const allSelected = selectedCount === users.length && users.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < users.length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('admin.userDetails.bulkActions')}
        </CardTitle>
        <CardDescription>
          {t('admin.userDetails.selectUsers')} - {selectedCount} {t('admin.userDetails.usersSelected')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All Users
          </label>
        </div>

        {selectedCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-2">
              <Select value={bulkRole} onValueChange={setBulkRole}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.userDetails.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">{t('admin.userDetails.client')}</SelectItem>
                  <SelectItem value="vendor">{t('admin.userDetails.vendor')}</SelectItem>
                  <SelectItem value="admin">{t('admin.userDetails.admin')}</SelectItem>
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={!bulkRole || loading}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    {t('admin.userDetails.bulkUpdateRole')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('admin.userDetails.confirmBulkAction')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Update role to "{bulkRole}" for {selectedCount} selected users?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkRoleUpdate}>
                      {t('common.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex gap-2">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.userDetails.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('admin.userDetails.pending')}</SelectItem>
                  <SelectItem value="approved">{t('admin.userDetails.approved')}</SelectItem>
                  <SelectItem value="blocked">{t('admin.userDetails.blocked')}</SelectItem>
                  <SelectItem value="rejected">{t('admin.userDetails.rejected')}</SelectItem>
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={!bulkStatus || loading}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {t('admin.userDetails.bulkUpdateStatus')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('admin.userDetails.confirmBulkAction')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Update status to "{bulkStatus}" for {selectedCount} selected users?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkStatusUpdate}>
                      {t('common.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportUsers}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('admin.userDetails.exportUsers')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};