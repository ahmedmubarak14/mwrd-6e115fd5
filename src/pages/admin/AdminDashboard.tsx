
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Admin dashboard content will be implemented here.</p>
          <p className="text-sm text-muted-foreground mt-2">
            This is the old admin dashboard component. Please use AdminDashboardOverview for the main admin dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
