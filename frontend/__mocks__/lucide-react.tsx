import React from 'react';

// Create a mock component factory
const createIconMock = (name: string) => 
  function IconMock(props: any) {
    return (
      <div data-testid={`${name}-icon`} {...props}>
        {name}
      </div>
    );
  };

// Export mock components
export const Ban = createIconMock('ban');
export const GitFork = createIconMock('git-fork');
export const ExternalLink = createIconMock('external-link');
export const AlertTriangle = createIconMock('alert-triangle');
export const Loader2 = createIconMock('loader2');
export const Trash2 = createIconMock('trash2');