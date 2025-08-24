
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const ClientProgressOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Requests Created</span>
              <span>8/10</span>
            </div>
            <Progress value={80} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Offers Reviewed</span>
              <span>25/30</span>
            </div>
            <Progress value={83} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Projects Completed</span>
              <span>3/5</span>
            </div>
            <Progress value={60} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Response Time</span>
            <span className="font-medium">2.5 hours</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Vendor Rating</span>
            <span className="font-medium">4.8/5.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Success Rate</span>
            <span className="font-medium">92%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost Savings</span>
            <span className="font-medium text-green-600">15%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
