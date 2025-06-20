/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Block } from '@/types';
import { CreateBlockModal } from '@/components/modals/CreateBlockModal';
import { Plus, Home, Building2, MapPin } from 'lucide-react';
import { getBlocks } from '@/services/blocService';
import { getAssociations } from '@/services/associationService';

export function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    loadBlocks();
  }, [page, debouncedSearch]);

  const loadBlocks = async () => {
    try {
      const associations = await getAssociations();
      const data = await getBlocks(associations.content[0].id, page, pageSize, search);
      setBlocks(data.content);
      setTotal(data.totalElements);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca blocurile.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Numele Blocului',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-green-600" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: 'associationName',
      header: 'Asociația',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span>{row.original.associationName}</span>
        </div>
      )
    },
    {
      accessorKey: 'address',
      header: 'Adresa',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.original.address}</span>
        </div>
      )
    },
    {
      accessorKey: 'apartmentsCount',
      header: 'Apartamente',
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.original.apartmentsCount || 0} apartamente
        </Badge>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Data Creării',
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString('ro-RO')
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Blocuri</h1>
          <p className="text-gray-600 mt-1">
            Gestionați toate blocurile din asociații
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Bloc Nou
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Blocurilor</CardTitle>
          <CardDescription>
            Toate blocurile înregistrate în sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={blocks}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(0); // resetăm pagina la 0 pe căutare nouă
            }}
            searchKey="name"
            searchPlaceholder="Căutați după numele blocului..."
          />
        </CardContent>
      </Card>

      <CreateBlockModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadBlocks}
      />
    </div>
  );
}