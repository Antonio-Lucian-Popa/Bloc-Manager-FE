/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Receipt, 
  Wrench, 
  MessageSquare,
  Plus,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Apartment, Expense, RepairRequest, DashboardStats } from '@/types';
import { CreateApartmentModal } from '@/components/modals/CreateApartmentModal';
import { CreateExpenseModal } from '@/components/modals/CreateExpenseModal';
import { CreateAnnouncementModal } from '@/components/modals/CreateAnnouncementModal';
import { CreateMeterReadingModal } from '@/components/modals/CreateMeterReadingModal';
import { getDashboardStats } from '@/services/dashboardService';
import { getExpenses } from '@/services/expenseService';
import { getRepairRequests } from '@/services/repairRequestService';
import { getApartments } from '@/services/apartmentService';

export function BlockAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [pendingRepairs, setPendingRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateApartment, setShowCreateApartment] = useState(false);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showCreateMeterReading, setShowCreateMeterReading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, apartmentsData, expensesData, repairsData] = await Promise.all([
        getDashboardStats(),
        getApartments(),
        getExpenses(),
        getRepairRequests(),
      ]);

      setStats(statsData);
      setApartments(apartmentsData);
      setRecentExpenses(expensesData.slice(0, 5));
      setPendingRepairs(repairsData.filter((r: RepairRequest) => r.status === 'PENDING').slice(0, 5));
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

  const apartmentColumns = [
    {
      accessorKey: 'number',
      header: 'Apartament',
    },
    {
      accessorKey: 'floor',
      header: 'Etaj',
    },
    {
      accessorKey: 'area',
      header: 'Suprafața (mp)',
    },
    {
      accessorKey: 'ownerName',
      header: 'Proprietar',
      cell: ({ row }: any) => row.original.ownerName || 'Nealocat',
    },
  ];

  const expenseColumns = [
    {
      accessorKey: 'description',
      header: 'Descriere',
    },
    {
      accessorKey: 'amount',
      header: 'Sumă',
      cell: ({ row }: any) => `${row.original.amount} RON`,
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const variant = status === 'PAID' ? 'default' : status === 'OVERDUE' ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
  ];

  const repairColumns = [
    {
      accessorKey: 'description',
      header: 'Descriere',
    },
    {
      accessorKey: 'location',
      header: 'Locația',
    },
    {
      accessorKey: 'priority',
      header: 'Prioritate',
      cell: ({ row }: any) => {
        const priority = row.original.priority;
        const variant = priority === 'HIGH' ? 'destructive' : priority === 'MEDIUM' ? 'secondary' : 'outline';
        return <Badge variant={variant}>{priority}</Badge>;
      },
    },
    {
      accessorKey: 'tenantName',
      header: 'Solicitant',
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Bloc</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateApartment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Apartament Nou
          </Button>
          <Button variant="outline" onClick={() => setShowCreateExpense(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Cheltuială Nouă
          </Button>
          <Button variant="outline" onClick={() => setShowCreateAnnouncement(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Anunț Nou
          </Button>
          <Button variant="outline" onClick={() => setShowCreateMeterReading(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Citire Contor
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Apartamente"
          value={stats.totalApartments || 0}
          description="Total apartamente"
          icon={Home}
          className="border-l-4 border-l-blue-500"
        />
        <DashboardCard
          title="Plăți Pendinte"
          value={stats.pendingPayments || 0}
          description="Necesită atenție"
          icon={DollarSign}
          className="border-l-4 border-l-orange-500"
        />
        <DashboardCard
          title="Reparații Pendinte"
          value={stats.pendingRepairs || 0}
          description="De rezolvat"
          icon={Wrench}
          className="border-l-4 border-l-red-500"
        />
        <DashboardCard
          title="Rata de Ocupare"
          value={`${stats.occupancyRate || 0}%`}
          description="Apartamente ocupate"
          icon={TrendingUp}
          className="border-l-4 border-l-green-500"
        />
      </div>

      {/* Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Apartamente</CardTitle>
            <CardDescription>
              Lista apartamentelor din bloc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={apartmentColumns}
              data={apartments}
              searchKey="number"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cheltuieli Recente</CardTitle>
            <CardDescription>
              Ultimele cheltuieli adăugate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={expenseColumns}
              data={recentExpenses}
              searchKey="description"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Sesizări de Reparații Pendinte
          </CardTitle>
          <CardDescription>
            Reparații care necesită atenție
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={repairColumns}
            data={pendingRepairs}
            searchKey="description"
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateApartmentModal
        open={showCreateApartment}
        onClose={() => setShowCreateApartment(false)}
        onSuccess={loadDashboardData}
      />
      <CreateExpenseModal
        open={showCreateExpense}
        onClose={() => setShowCreateExpense(false)}
        onSuccess={loadDashboardData}
      />
      <CreateAnnouncementModal
        open={showCreateAnnouncement}
        onClose={() => setShowCreateAnnouncement(false)}
        onSuccess={() => {}}
      />
      <CreateMeterReadingModal
        open={showCreateMeterReading}
        onClose={() => setShowCreateMeterReading(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}