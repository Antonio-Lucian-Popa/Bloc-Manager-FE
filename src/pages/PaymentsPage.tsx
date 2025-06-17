import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Payment } from '@/types';
import { CreditCard, Calendar, Hash, DollarSign } from 'lucide-react';
import { getPayments } from '@/services/paymentService';
import { getAssociations } from '@/services/associationService';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffectOnce } from 'react-use';


export function PaymentsPage() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [associationId, setAssociationId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      if (!associationId) return;

      const res = await getPayments({
        page,
        size: pageSize,
        search: debouncedSearch,
        associationId,
      });

      setPayments(res.content);
      setTotal(res.totalElements);
    } catch (err) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca plățile.',
        variant: 'destructive',
      });
    }
  };

  // Fetch initial associationId once
  useEffectOnce(() => {
    getAssociations().then((res) => {
      if (res.content.length > 0) {
        setAssociationId(res.content[0].id);
      }
    });
  });

  useEffect(() => {
    if (associationId) {
      loadData();
    }
  }, [page, pageSize, debouncedSearch, associationId]);

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
      cell: ({ row }: any) =>
        row.original.reference ? (
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-sm">{row.original.reference}</span>
          </div>
        ) : (
          '-'
        ),
    },
    {
      accessorKey: 'apartmentNumber',
      header: 'Apartament',
      cell: ({ row }: any) => (
        <Badge variant="outline">Ap. {row.original.apartmentNumber || 'N/A'}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plăți</h1>
          <p className="text-gray-600 mt-1">Vizualizați toate plățile efectuate</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Istoricul Plăților</CardTitle>
          <CardDescription>Toate plățile înregistrate în sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onSearchChange={setSearch}
            searchKey="reference"
            searchPlaceholder="Căutați după referință, metodă sau sumă..."
          />
        </CardContent>
      </Card>
    </div>
  );
}