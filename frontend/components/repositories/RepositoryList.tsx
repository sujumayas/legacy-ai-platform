import React from 'react';
import { Repository } from '@/types/repository';
import { RepositoryCard } from './RepositoryCard';

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
          <RepositoryCard 
            key={repo.id} 
            repository={repo}
          />
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