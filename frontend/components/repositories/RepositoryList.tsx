import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Repository } from '@/types/repository';

// Sample data for development
const sampleRepositories: Repository[] = [
  {
    id: 1,
    github_url: 'https://github.com/example/java-legacy',
    name: 'java-legacy',
    owner: 'example',
    default_branch: 'main',
    status: 'ready',
    last_analyzed: null,
    error_message: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 1
  },
  {
    id: 2,
    github_url: 'https://github.com/example/spring-app',
    name: 'spring-app',
    owner: 'example',
    default_branch: 'master',
    status: 'analyzing',
    last_analyzed: new Date().toISOString(),
    error_message: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 1
  }
];

export const RepositoryList: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Your Repositories</h2>
      </div>

      <div className="grid gap-4">
        {sampleRepositories.map((repo) => (
          <Card key={repo.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {repo.owner}/{repo.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500">
                    {repo.github_url}
                  </p>

                  <div className="flex items-center space-x-2">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        repo.status === 'ready' ? 'bg-green-100 text-green-800' :
                        repo.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                        repo.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {repo.status}
                    </span>
                  </div>

                  {repo.last_analyzed && (
                    <p className="text-sm text-gray-500">
                      Last analyzed: {new Date(repo.last_analyzed).toLocaleDateString()}
                    </p>
                  )}

                  {repo.error_message && (
                    <p className="text-sm text-red-600">
                      {repo.error_message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sampleRepositories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No repositories connected yet.</p>
        </div>
      )}
    </div>
  );
};
