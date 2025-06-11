import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Apartment } from '@/types';
import { CreateApartmentModal } from '@/components/modals/CreateApartmentModal';
import { Plus, Home, User, Layers, Square } from 'lucide-react';

export function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      const data = await apiService.getApartments();
      setApartments(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca apartamentele.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'number',
      header: 'Apartament',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Ap. {row.original.number}</span>
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
      accessorKey: 'floor',
      header: 'Etaj',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-gray-400" />
          <span>Etajul {row.original.floor}</span>
        </div>
      ),
    },
    {
      accessorKey: 'area',
      header: 'Suprafața',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Square className="h-4 w-4 text-gray-400" />
          <span>{row.original.area} mp</span>
        </div>
      ),
    },
    {
      accessorKey: 'ownerName',
      header: 'Proprietar',
      cell: ({ row }: any) => row.original.ownerName ? (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-green-600" />
          <span>{row.original.ownerName}</span>
        </div>
      ) : (
        <Badge variant="outline">Nealocat</Badge>
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
          <h1 className="text-3xl font-bold text-gray-900">Apartamente</h1>
          <p className="text-gray-600 mt-1">
            Gestionați apartamentele din bloc
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Apartament Nou
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Apartamentelor</CardTitle>
          <CardDescription>
            Toate apartamentele din blocul dvs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={apartments}
            searchKey="number"
            searchPlaceholder="Căutați după numărul apartamentului..."
          />
        </CardContent>
      </Card>

      <CreateApartmentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadApartments}
      />
    </div>
  );
}