
import { UserManagementDashboard } from "@/components/admin/UserManagementDashboard";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

const AdminUsers = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <AdminPageContainer
      title={t('admin.userManagement.management')}
      description={t('admin.userManagement.manageDescription')}
    >
      <div data-admin-dashboard className={cn(isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <UserManagementDashboard />
      </div>
    </AdminPageContainer>
  );
};

export default AdminUsers;
