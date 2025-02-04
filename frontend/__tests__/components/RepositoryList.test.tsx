import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RepositoryList } from '@/components/repositories/RepositoryList';
import { useRepositories } from '@/hooks/useRepositories';

// Mock the custom hook
vi.mock('@/hooks/useRepositories');

const mockRepositories = [
  {
    id: 1,
    github_url: 'https://github.com/test/repo1',
    name: 'repo1',
    owner: 'test',
    default_branch: 'main',
    status: 'ready' as const,
    last_analyzed: null,
    error_message: null,
    created_at: '2025-02-04T00:00:00Z',
    updated_at: '2025-02-04T00:00:00Z',
    user_id: 1
  }
];

describe('RepositoryList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    vi.mocked(useRepositories).mockReturnValue({
      repositories: [],
      loading: true,
      error: null,
      refetch: vi.fn()
    });

    render(<RepositoryList />);
    
    // Check for skeleton components
    const heading = screen.getByText('Your Repositories');
    expect(heading).toBeInTheDocument();
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(3); // 3 skeleton cards
  });

  it('should render repositories', async () => {
    vi.mocked(useRepositories).mockReturnValue({
      repositories: mockRepositories,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RepositoryList />);
    
    await waitFor(() => {
      expect(screen.getByText('test/repo1')).toBeInTheDocument();
    });
  });

  it('should show empty state', () => {
    vi.mocked(useRepositories).mockReturnValue({
      repositories: [],
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RepositoryList />);
    
    expect(screen.getByText('No Repositories')).toBeInTheDocument();
    expect(screen.getByText('Get started by connecting a repository.')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Failed to fetch repositories';
    vi.mocked(useRepositories).mockReturnValue({
      repositories: [],
      loading: false,
      error: errorMessage,
      refetch: vi.fn()
    });

    render(<RepositoryList />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should handle repository with error message', () => {
    const repoWithError = {
      ...mockRepositories[0],
      status: 'error' as const,
      error_message: 'Failed to analyze repository'
    };

    vi.mocked(useRepositories).mockReturnValue({
      repositories: [repoWithError],
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RepositoryList />);
    
    expect(screen.getByText('Failed to analyze repository')).toBeInTheDocument();
  });

  it('should show last analyzed date when available', () => {
    const repoWithAnalysis = {
      ...mockRepositories[0],
      last_analyzed: '2025-02-04T00:00:00Z'
    };

    vi.mocked(useRepositories).mockReturnValue({
      repositories: [repoWithAnalysis],
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RepositoryList />);
    
    expect(screen.getByText(/Feb 4, 2025/)).toBeInTheDocument();
  });
});