import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/types';
import { CreateExpenseModal } from '@/components/modals/CreateExpenseModal';
import { Plus, Receipt, DollarSign, Calendar, Tag } from 'lucide-react';
import { getExpenses } from '@/services/expenseService';

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
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
      accessorKey: 'description',
      header: 'Descriere',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Receipt className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.original.description}</span>
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
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <Badge variant="outline">{row.original.category}</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'blockName',
      header: 'Blocul',
      cell: ({ row }: any) => (
        <Badge variant="secondary">{row.original.blockName}</Badge>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Scadența',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.original.dueDate).toLocaleDateString('ro-RO')}</span>
        </div>
      ),
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
    {
      accessorKey: 'createdAt',
      header: 'Data Creării',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString('ro-RO'),
    },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Cheltuieli</h1>
          <p className="text-gray-600 mt-1">
            Gestionați cheltuielile blocului
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Cheltuială Nouă
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Cheltuielilor</CardTitle>
          <CardDescription>
            Toate cheltuielile înregistrate pentru bloc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={expenses}
            searchKey="description"
            searchPlaceholder="Căutați după descrierea cheltuielii..."
          />
        </CardContent>
      </Card>

      <CreateExpenseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadExpenses}
      />
    </div>
  );
}