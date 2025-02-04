import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, GitFork } from "lucide-react";
import { Repository } from '@/types/repository';
import { StatusBadge } from './StatusBadge';

interface RepositoryCardProps {
  repository: Repository;
  onDelete?: (id: number) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ 
  repository,
  onDelete 
}) => {
  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <GitFork className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">
                {repository.owner}/{repository.name}
              </h3>
            </div>
            <StatusBadge status={repository.status} />
          </div>

          {/* Repository URL */}
          <a 
            href={repository.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View on GitHub
          </a>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div>
              <p className="text-gray-500">Branch</p>
              <p className="font-medium">{repository.default_branch}</p>
            </div>
            {repository.last_analyzed && (
              <div>
                <p className="text-gray-500">Last Analyzed</p>
                <p className="font-medium">{formattedDate(repository.last_analyzed)}</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {repository.error_message && (
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {repository.error_message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};