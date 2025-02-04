import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Ban: () => <div data-testid="ban-icon" />,
  GitFork: () => <div data-testid="git-fork-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />
}));

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});