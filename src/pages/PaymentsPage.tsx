import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Payment } from '@/types';
import { CreditCard, Calendar, Hash, DollarSign } from 'lucide-react';
import { getPayments } from '@/services/paymentService';

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca plățile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
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
      accessorKey: 'paymentDate',
      header: 'Data Plății',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.original.paymentDate).toLocaleDateString('ro-RO')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Metoda',
      cell: ({ row }: any) => {
        const method = row.original.method;
        const text = method === 'CASH' ? 'Numerar' : method === 'CARD' ? 'Card' : 'Transfer';
        const variant = method === 'CASH' ? 'secondary' : method === 'CARD' ? 'default' : 'outline';
        return (
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <Badge variant={variant}>{text}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'reference',
      header: 'Referință',
      cell: ({ row }: any) => row.original.reference ? (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm">{row.original.reference}</span>
        </div>
      ) : '-',
    },
    {
      accessorKey: 'apartmentNumber',
      header: 'Apartament',
      cell: ({ row }: any) => (
        <Badge variant="outline">Ap. {row.original.apartmentNumber || 'N/A'}</Badge>
      ),
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
          <h1 className="text-3xl font-bold text-gray-900">Plăți</h1>
          <p className="text-gray-600 mt-1">
            Vizualizați toate plățile efectuate
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Istoricul Plăților</CardTitle>
          <CardDescription>
            Toate plățile înregistrate în sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            searchKey="reference"
            searchPlaceholder="Căutați după referința plății..."
          />
        </CardContent>
      </Card>
    </div>
  );
}