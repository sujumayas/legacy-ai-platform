import '@testing-library/jest-dom';
import { vi } from 'vitest';

const mockRouter = {
  route: '/',
  pathname: '',
  query: '',
  asPath: '',
  push: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn()
  },
  beforePopState: vi.fn(),
  prefetch: vi.fn()
};

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Ban: () => '<div data-testid="ban-icon" />',
  GitFork: () => '<div data-testid="git-fork-icon" />',
  ExternalLink: () => '<div data-testid="external-link-icon" />',
  AlertTriangle: () => '<div data-testid="alert-triangle-icon" />'
}));