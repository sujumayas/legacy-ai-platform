import { renderHook, act } from '@testing-library/react';
import { useRepositories } from '@/hooks/useRepositories';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useRepositories', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch repositories successfully', async () => {
    const mockRepositories = [
      {
        id: 1,
        github_url: 'https://github.com/test/repo1',
        name: 'repo1',
        owner: 'test',
        default_branch: 'main',
        status: 'ready',
        last_analyzed: null,
        error_message: null,
        created_at: '2025-02-04T00:00:00Z',
        updated_at: '2025-02-04T00:00:00Z',
        user_id: 1
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    const { result } = renderHook(() => useRepositories());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // After loading
    expect(result.current.loading).toBe(false);
    expect(result.current.repositories).toEqual(mockRepositories);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch repositories';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage })
    });

    const { result } = renderHook(() => useRepositories());

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRepositories());

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('should allow manual refetch', async () => {
    const mockRepositories = [{ id: 1, name: 'repo1' }];
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepositories
      });

    const { result } = renderHook(() => useRepositories());

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.repositories).toEqual([]);

    // Trigger refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.repositories).toEqual(mockRepositories);
  });
});