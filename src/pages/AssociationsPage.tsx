import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Association } from '@/types';
import { CreateAssociationModal } from '@/components/modals/CreateAssociationModal';
import { Plus, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { getAssociations } from '@/services/associationService';

export function AssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

   useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [debouncedSearch, page]);

  useEffect(() => {
    loadAssociations();
  }, []);

  const loadAssociations = async () => {
    try {
      const data = await getAssociations();
      setAssociations(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca asociațiile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Numele Asociației',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Adresa',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telefon',
      cell: ({ row }: any) => row.original.phone ? (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{row.original.phone}</span>
        </div>
      ) : '-',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: any) => row.original.email ? (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{row.original.email}</span>
        </div>
      ) : '-',
    },
    {
      accessorKey: 'blocksCount',
      header: 'Blocuri',
      cell: ({ row }: any) => (
        <Badge variant="secondary">
          {row.original.blocksCount || 0} blocuri
        </Badge>
      ),
    },
    {
      accessorKey: 'apartmentsCount',
      header: 'Apartamente',
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.original.apartmentsCount || 0} apartamente
        </Badge>
      ),
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
          <h1 className="text-3xl font-bold text-gray-900">Asociații de Proprietari</h1>
          <p className="text-gray-600 mt-1">
            Gestionați toate asociațiile de proprietari din sistem
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Asociație Nouă
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Asociațiilor</CardTitle>
          <CardDescription>
            Toate asociațiile de proprietari înregistrate în sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
           <DataTable
              columns={columns}
              data={associations}
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onSearchChange={setSearch}
              searchKey="name"
              searchPlaceholder="Căutați după numele asociației..."
            />
        </CardContent>
      </Card>

      <CreateAssociationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadAssociations}
      />
    </div>
  );
}