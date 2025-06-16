import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAssociationDashboard } from '@/components/dashboard/AdminAssociationDashboard';
import { BlockAdminDashboard } from '@/components/dashboard/BlockAdminDashboard';
import { TenantDashboard } from '@/components/dashboard/TenantDashboard';

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role.role) {
    case 'ADMIN_ASSOCIATION':
      return <AdminAssociationDashboard />;
    case 'BLOCK_ADMIN':
      return <BlockAdminDashboard />;
    case 'LOCATAR':
      return <TenantDashboard />;
    default: 
      return <div>Rol necunoscut</div>;
  }
}