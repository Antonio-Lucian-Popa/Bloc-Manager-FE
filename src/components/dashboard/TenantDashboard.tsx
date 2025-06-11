import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Receipt, 
  DollarSign, 
  MessageSquare,
  Plus,
  AlertCircle,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { Apartment, ApartmentExpense, Payment, Announcement, RepairRequest } from '@/types';
import { CreateRepairRequestModal } from '@/components/modals/CreateRepairRequestModal';
import { CreatePaymentModal } from '@/components/modals/CreatePaymentModal';

export function TenantDashboard() {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [expenses, setExpenses] = useState<ApartmentExpense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRepair, setShowCreateRepair] = useState(false);
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // For demo purposes, using apartment ID 1
      const apartmentId = '1';
      
      const [apartmentData, expensesData, paymentsData, announcementsData, repairsData] = await Promise.all([
        apiService.getApartment(apartmentId),
        apiService.getApartmentExpenses(apartmentId),
        apiService.getPayments(apartmentId),
        apiService.getAnnouncements(),
        apiService.getRepairRequests(undefined, apartmentId),
      ]);

      setApartment(apartmentData);
      setExpenses(expensesData);
      setPayments(paymentsData);
      setAnnouncements(announcementsData.slice(0, 5));
      setRepairRequests(repairsData);
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

  const expenseColumns = [
    {
      accessorKey: 'expense.description',
      header: 'Descriere',
    },
    {
      accessorKey: 'amount',
      header: 'Sumă',
      cell: ({ row }: any) => `${row.original.amount} RON`,
    },
    {
      accessorKey: 'dueDate',
      header: 'Scadență',
      cell: ({ row }: any) => new Date(row.original.dueDate).toLocaleDateString('ro-RO'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const variant = status === 'PAID' ? 'success' : status === 'OVERDUE' ? 'destructive' : 'secondary';
        const text = status === 'PAID' ? 'Plătit' : status === 'OVERDUE' ? 'Întârziat' : 'Pending';
        return <Badge variant={variant}>{text}</Badge>;
      },
    },
  ];

  const paymentColumns = [
    {
      accessorKey: 'amount',
      header: 'Sumă',
      cell: ({ row }: any) => `${row.original.amount} RON`,
    },
    {
      accessorKey: 'paymentDate',
      header: 'Data Plății',
      cell: ({ row }: any) => new Date(row.original.paymentDate).toLocaleDateString('ro-RO'),
    },
    {
      accessorKey: 'method',
      header: 'Metoda',
      cell: ({ row }: any) => {
        const method = row.original.method;
        const text = method === 'CASH' ? 'Numerar' : method === 'CARD' ? 'Card' : 'Transfer';
        return text;
      },
    },
    {
      accessorKey: 'reference',
      header: 'Referință',
    },
  ];

  const announcementColumns = [
    {
      accessorKey: 'title',
      header: 'Titlu',
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
      accessorKey: 'createdAt',
      header: 'Data',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString('ro-RO'),
    },
    {
      accessorKey: 'authorName',
      header: 'Autor',
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const variant = status === 'COMPLETED' ? 'success' : 
                      status === 'IN_PROGRESS' ? 'secondary' : 
                      status === 'REJECTED' ? 'destructive' : 'outline';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Data Sesizării',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString('ro-RO'),
    },
  ];

  const pendingExpenses = expenses.filter(e => e.status === 'PENDING');
  const overdueExpenses = expenses.filter(e => e.status === 'OVERDUE');
  const totalDebt = [...pendingExpenses, ...overdueExpenses].reduce((sum, e) => sum + e.amount, 0);

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Locatar</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateRepair(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Sesizare Nouă
          </Button>
          <Button variant="outline" onClick={() => setShowCreatePayment(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Efectuează Plată
          </Button>
        </div>
      </div>

      {/* Apartment Info */}
      {apartment && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Apartamentul {apartment.number}
            </CardTitle>
            <CardDescription>
              {apartment.blockName} • Etajul {apartment.floor} • {apartment.area} mp
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Cheltuieli Pendinte"
          value={pendingExpenses.length}
          description="De plătit"
          icon={Receipt}
          className="border-l-4 border-l-orange-500"
        />
        <DashboardCard
          title="Întârzieri"
          value={overdueExpenses.length}
          description="Scadente"
          icon={AlertCircle}
          className="border-l-4 border-l-red-500"
        />
        <DashboardCard
          title="Total de Plată"
          value={`${totalDebt} RON`}
          description="Sumă restantă"
          icon={DollarSign}
          className="border-l-4 border-l-purple-500"
        />
        <DashboardCard
          title="Sesizări Active"
          value={repairRequests.filter(r => r.status !== 'COMPLETED').length}
          description="În lucru"
          icon={MessageSquare}
          className="border-l-4 border-l-green-500"
        />
      </div>

      {/* Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cheltuielile Mele</CardTitle>
            <CardDescription>
              Cheltuieli repartizate pentru apartament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={expenseColumns}
              data={expenses}
              searchKey="expense.description"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Istoricul Plăților</CardTitle>
            <CardDescription>
              Plățile efectuate recent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={paymentColumns}
              data={payments}
              searchKey="reference"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Anunțuri</CardTitle>
            <CardDescription>
              Anunțuri din bloc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={announcementColumns}
              data={announcements}
              searchKey="title"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sesizările Mele</CardTitle>
            <CardDescription>
              Sesizări de reparații trimise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={repairColumns}
              data={repairRequests}
              searchKey="description"
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateRepairRequestModal
        open={showCreateRepair}
        onClose={() => setShowCreateRepair(false)}
        onSuccess={loadDashboardData}
      />
      <CreatePaymentModal
        open={showCreatePayment}
        onClose={() => setShowCreatePayment(false)}
        onSuccess={loadDashboardData}
        pendingExpenses={pendingExpenses}
      />
    </div>
  );
}