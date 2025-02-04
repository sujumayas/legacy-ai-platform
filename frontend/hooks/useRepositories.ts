import { useState, useEffect } from 'react';
import { Repository } from '@/types/repository';

interface UseRepositoriesReturn {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRepositories = (): UseRepositoriesReturn => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/repos/list');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  return {
    repositories,
    loading,
    error,
    refetch: fetchRepositories
  };
};