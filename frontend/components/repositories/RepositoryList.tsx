import React from 'react';
import { RepositoryCard } from './RepositoryCard';
import { RepositoryCardSkeleton } from './RepositoryCardSkeleton';
import { useRepositories } from '@/hooks/useRepositories';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ban, AlertTriangle } from "lucide-react";

export const RepositoryList: React.FC = () => {
  const { repositories, loading, error, refetch } = useRepositories();

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <RepositoryCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (repositories.length === 0) {
      return (
        <div className="text-center py-12">
          <Ban className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Repositories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by connecting a repository.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {repositories.map((repo) => (
          <RepositoryCard 
            key={repo.id} 
            repository={repo}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Your Repositories</h2>
      </div>

      {renderContent()}
    </div>
  );
};