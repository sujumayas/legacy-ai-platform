import React from 'react';
import { Badge } from "@/components/ui/badge";
import { RepositoryStatus } from '@/types/repository';

interface StatusBadgeProps {
  status: RepositoryStatus;
}

const statusConfig = {
  ready: {
    variant: 'success' as const,
    label: 'Ready'
  },
  analyzing: {
    variant: 'default' as const,
    label: 'Analyzing'
  },
  connecting: {
    variant: 'secondary' as const,
    label: 'Connecting'
  },
  error: {
    variant: 'destructive' as const,
    label: 'Error'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};