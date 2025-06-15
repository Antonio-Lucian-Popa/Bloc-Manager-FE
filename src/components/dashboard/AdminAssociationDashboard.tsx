/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Home, 
  Users, 
  Receipt,
  Plus,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { Association, Block, DashboardStats } from '@/types';
import { CreateAssociationModal } from '@/components/modals/CreateAssociationModal';
import { CreateBlockModal } from '@/components/modals/CreateBlockModal';
import { InviteUserModal } from '@/components/modals/InviteUserModal';
import { getDashboardStats } from '@/services/dashboardService';
import { getAssociations } from '@/services/associationService';
import { getBlocks } from '@/services/blocService';

export function AdminAssociationDashboard() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [associations, setAssociations] = useState<Association[]>([]);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAssociation, setShowCreateAssociation] = useState(false);
  const [showCreateBlock, setShowCreateBlock] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, associationsData, blocksData] = await Promise.all([
        getDashboardStats(),
        getAssociations(),
        getBlocks(),
      ]);

      setStats(statsData);
      setAssociations(associationsData as Association[]);
      setRecentBlocks(blocksData.slice(0, 5));
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca datele dashboard-ului.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const associationColumns = [
    {
      accessorKey: 'name',
      header: 'Numele Asociației',
    },
    {
      accessorKey: 'address',
      header: 'Adresa',
    },
    {
      accessorKey: 'blocksCount',
      header: 'Blocuri',
      cell: ({ row }: any) => row.original.blocksCount || 0,
    },
    {
      accessorKey: 'apartmentsCount',
      header: 'Apartamente',
      cell: ({ row }: any) => row.original.apartmentsCount || 0,
    },
  ];

  const blockColumns = [
    {
      accessorKey: 'name',
      header: 'Numele Blocului',
    },
    {
      accessorKey: 'associationName',
      header: 'Asociația',
    },
    {
      accessorKey: 'address',
      header: 'Adresa',
    },
    {
      accessorKey: 'apartmentsCount',
      header: 'Apartamente',
      cell: ({ row }: any) => row.original.apartmentsCount || 0,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Asociație</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateAssociation(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Asociație Nouă
          </Button>
          <Button variant="outline" onClick={() => setShowCreateBlock(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Bloc Nou
          </Button>
          <Button variant="outline" onClick={() => setShowInviteUser(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invită Utilizator
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Asociații"
          value={stats.totalAssociations || 0}
          description="Asociații active"
          icon={Building2}
          className="border-l-4 border-l-blue-500"
        />
        <DashboardCard
          title="Total Blocuri"
          value={stats.totalBlocks || 0}
          description="Blocuri gestionate"
          icon={Home}
          className="border-l-4 border-l-green-500"
        />
        <DashboardCard
          title="Total Apartamente"
          value={stats.totalApartments || 0}
          description="Unități locative"
          icon={Users}
          className="border-l-4 border-l-orange-500"
        />
        <DashboardCard
          title="Venituri Totale"
          value={`${stats.totalRevenue || 0} RON`}
          description="În luna curentă"
          icon={DollarSign}
          className="border-l-4 border-l-purple-500"
        />
      </div>

      {/* Recent Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asociații Recent Create</CardTitle>
            <CardDescription>
              Ultimele asociații adăugate în sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={associationColumns}
              data={associations}
              searchKey="name"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocuri Recent Adăugate</CardTitle>
            <CardDescription>
              Ultimele blocuri create în asociații
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={blockColumns}
              data={recentBlocks}
              searchKey="name"
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateAssociationModal
        open={showCreateAssociation}
        onClose={() => setShowCreateAssociation(false)}
        onSuccess={loadDashboardData}
      />
      <CreateBlockModal
        open={showCreateBlock}
        onClose={() => setShowCreateBlock(false)}
        onSuccess={loadDashboardData}
      />
      <InviteUserModal
        open={showInviteUser}
        onClose={() => setShowInviteUser(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}