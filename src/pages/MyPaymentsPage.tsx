import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Payment } from '@/types';
import { CreditCard, Calendar, Hash, DollarSign, TrendingUp } from 'lucide-react';

export function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      // For demo purposes, using apartment ID 1
      const apartmentId = '1';
      const data = await apiService.getPayments(apartmentId);
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
  ];

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const thisMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.paymentDate);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Plățile Mele</h1>
        <p className="text-gray-600 mt-1">
          Istoricul complet al plăților efectuate
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Plătit</p>
                <p className="text-2xl font-bold text-gray-900">{totalPaid} RON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Luna Curentă</p>
                <p className="text-2xl font-bold text-gray-900">{thisMonthTotal} RON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Plăți</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Istoricul Plăților</CardTitle>
          <CardDescription>
            Toate plățile efectuate pentru apartamentul dvs.
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