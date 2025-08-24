
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface Request {
  id: number;
  title: string;
  status: string;
  offers: number;
  deadline: string;
  budget: number;
}

interface ClientRecentRequestsProps {
  requests: Request[];
}

export const ClientRecentRequests = ({ requests }: ClientRecentRequestsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Procurement Requests
          <Button variant="outline" size="sm">View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                </div>
                <div>
                  <h3 className="font-medium">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Budget: {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'SAR',
                      minimumFractionDigits: 0
                    }).format(request.budget)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {request.offers} offers • Due {request.deadline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
