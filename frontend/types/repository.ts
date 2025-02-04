export type RepositoryStatus = 'connecting' | 'ready' | 'analyzing' | 'error';

export interface Repository {
  id: number;
  github_url: string;
  name: string;
  owner: string;
  default_branch: string;
  status: RepositoryStatus;
  last_analyzed: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
}