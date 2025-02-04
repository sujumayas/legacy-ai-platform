import '@testing-library/jest-dom';
import type { jest } from '@jest/globals';

const mockRouter = {
  route: '/',
  pathname: '',
  query: '',
  asPath: '',
  push: () => Promise.resolve(true),
  events: {
    on: () => jest.fn(),
    off: () => jest.fn()
  },
  beforePopState: () => jest.fn(),
  prefetch: () => Promise.resolve()
};

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Ban: () => '<div data-testid="ban-icon" />',
  GitFork: () => '<div data-testid="git-fork-icon" />',
  ExternalLink: () => '<div data-testid="external-link-icon" />',
  AlertTriangle: () => '<div data-testid="alert-triangle-icon" />'
}));