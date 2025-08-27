import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AdminTableSkeletonProps {
  rows?: number;
  columns?: number;
  showFilters?: boolean;
  showActions?: boolean;
}

export const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({
  rows = 8,
  columns = 6,
  showFilters = true,
  showActions = true
}) => {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          {showActions && <Skeleton className="h-9 w-24" />}
        </div>
        
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 w-full sm:w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                {Array.from({ length: columns - 1 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  {Array.from({ length: columns - 1 }).map((_, j) => (
                    <TableCell key={j}>
                      {j === 0 ? (
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ) : j === columns - 2 ? (
                        <Skeleton className="h-6 w-16 rounded-full" />
                      ) : j === columns - 3 ? (
                        <div className="flex gap-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      ) : (
                        <Skeleton className="h-4 w-16" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-12" />
            <Skeleton className="h-9 w-12" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};