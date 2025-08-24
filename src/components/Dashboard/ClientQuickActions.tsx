
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Eye,
  MessageSquare
} from 'lucide-react';

export const ClientQuickActions = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create New Request
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Browse Vendors
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Messages
      </Button>
    </div>
  );
};
