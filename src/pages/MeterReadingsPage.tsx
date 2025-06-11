import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MeterReading } from '@/types';
import { CreateMeterReadingModal } from '@/components/modals/CreateMeterReadingModal';
import { Plus, Gauge, Home, Calendar, TrendingUp } from 'lucide-react';

export function MeterReadingsPage() {
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const canCreateReadings = user?.role === 'BLOCK_ADMIN' || user?.role === 'ADMIN_ASSOCIATION';

  useEffect(() => {
    loadMeterReadings();
  }, []);

  const loadMeterReadings = async () => {
    try {
      const data = await apiService.getMeterReadings();
      setMeterReadings(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca citirile contorului.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'apartmentNumber',
      header: 'Apartament',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Ap. {row.original.apartmentNumber || 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'meterType',
      header: 'Tip Contor',
      cell: ({ row }: any) => {
        const type = row.original.meterType;
        const text = type === 'WATER' ? 'Apă' : type === 'GAS' ? 'Gaz' : 'Electricitate';
        const variant = type === 'WATER' ? 'default' : type === 'GAS' ? 'secondary' : 'outline';
        
        return (
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-gray-400" />
            <Badge variant={variant}>{text}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'currentReading',
      header: 'Citire Curentă',
      cell: ({ row }: any) => (
        <span className="font-semibold">{row.original.currentReading}</span>
      ),
    },
    {
      accessorKey: 'previousReading',
      header: 'Citire Anterioară',
      cell: ({ row }: any) => (
        <span>{row.original.previousReading || '-'}</span>
      ),
    },
    {
      accessorKey: 'consumption',
      header: 'Consum',
      cell: ({ row }: any) => {
        const consumption = row.original.consumption;
        return consumption ? (
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium">{consumption}</span>
          </div>
        ) : '-';
      },
    },
    {
      accessorKey: 'readingDate',
      header: 'Data Citirii',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.original.readingDate).toLocaleDateString('ro-RO')}</span>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Citiri Contoare</h1>
          <p className="text-gray-600 mt-1">
            {canCreateReadings 
              ? 'Gestionați citirile contorilor din bloc' 
              : 'Vizualizați citirile contorilor'
            }
          </p>
        </div>
        {canCreateReadings && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Citire Nouă
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Istoricul Citirilor</CardTitle>
          <CardDescription>
            Toate citirile contorilor înregistrate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={meterReadings}
            searchKey="apartmentNumber"
            searchPlaceholder="Căutați după numărul apartamentului..."
          />
        </CardContent>
      </Card>

      {canCreateReadings && (
        <CreateMeterReadingModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadMeterReadings}
        />
      )}
    </div>
  );
}