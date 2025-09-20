'use client';

import { ReactNode } from 'react';

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
  loadingComponent?: ReactNode;
}

export default function RequireRole({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login',
  loadingComponent 
}: RequireRoleProps) {
  // Demo mode: always allow access
  // In a real app, this would check user roles from Firebase
  
  return <>{children}</>;
}
