import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RepositoryCardSkeleton: React.FC = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Repository URL */}
          <Skeleton className="h-4 w-32" />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};