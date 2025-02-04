import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Repository {
  id: number;
  github_url: string;
  name: string;
  owner: string;
  status: string;
  last_analyzed: string | null;
  error_message: string | null;
}

export const RepositoryList: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repos/list');
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load repositories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRepository = async (id: number) => {
    try {
      const response = await fetch(`/api/repos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete repository');
      
      setRepositories(repos => repos.filter(repo => repo.id !== id));
      toast({
        title: "Success",
        description: "Repository deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete repository",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No repositories connected yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {repositories.map((repo) => (
        <Card key={repo.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {repo.owner}/{repo.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {repo.github_url}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    repo.status === 'ready' ? 'bg-green-100 text-green-800' :
                    repo.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                    repo.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {repo.status}
                  </span>
                </div>
                {repo.error_message && (
                  <p className="text-sm text-red-600 mt-2">
                    {repo.error_message}
                  </p>
                )}
                {repo.last_analyzed && (
                  <p className="text-sm text-gray-500 mt-2">
                    Last analyzed: {new Date(repo.last_analyzed).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-600"
                onClick={() => deleteRepository(repo.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
