/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApartmentExpenses } from '@/services/expenseService';
import { useToast } from '@/hooks/use-toast';
import { ApartmentExpense } from '@/types';
import { CreatePaymentModal } from '@/components/modals/CreatePaymentModal';
import { Receipt, Calendar, DollarSign, AlertCircle, CreditCard } from 'lucide-react';

export function MyExpensesPage() {
  const [expenses, setExpenses] = useState<ApartmentExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      // For demo purposes, using apartment ID 1
      const apartmentId = '1';
      const data = await getApartmentExpenses(apartmentId);
      setExpenses(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca cheltuielile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'expense.description',
      header: 'Descriere',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Receipt className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.original.expense.description}</span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Sumă',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold">{row.original.amount} RON</span>
        </div>
      ),
    },
    {
      accessorKey: 'expense.category',
      header: 'Categoria',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original.expense.category}</Badge>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Scadența',
      cell: ({ row }: any) => {
        const dueDate = new Date(row.original.dueDate);
        const isOverdue = dueDate < new Date() && row.original.status !== 'PAID';
        
        return (
          <div className="flex items-center space-x-2">
            <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {dueDate.toLocaleDateString('ro-RO')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const variant = status === 'PAID' ? 'default' : status === 'OVERDUE' ? 'destructive' : 'secondary';
        const text = status === 'PAID' ? 'Plătit' : status === 'OVERDUE' ? 'Întârziat' : 'Pending';
        const icon = status === 'OVERDUE' ? <AlertCircle className="h-3 w-3" /> : null;
        
        return (
          <div className="flex items-center space-x-1">
            {icon}
            <Badge variant={variant}>{text}</Badge>
          </div>
        );
      },
    },
  ];

  const pendingExpenses = expenses.filter(e => e.status === 'PENDING' || e.status === 'OVERDUE');
  const totalDebt = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const overdueCount = expenses.filter(e => e.status === 'OVERDUE').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="h-64 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cheltuielile Mele</h1>
          <p className="text-gray-600 mt-1">
            Vizualizați și gestionați cheltuielile apartamentului dvs.
          </p>
        </div>
        {pendingExpenses.length > 0 && (
          <Button onClick={() => setShowPaymentModal(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Efectuează Plată
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cheltuieli</p>
                <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Plată</p>
                <p className="text-2xl font-bold text-gray-900">{totalDebt} RON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Întârzieri</p>
                <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Cheltuielilor</CardTitle>
          <CardDescription>
            Toate cheltuielile repartizate pentru apartamentul dvs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={expenses}
            searchKey="expense.description"
            searchPlaceholder="Căutați după descrierea cheltuielii..."
          />
        </CardContent>
      </Card>

      <CreatePaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={loadExpenses}
        pendingExpenses={pendingExpenses}
      />
    </div>
  );
}