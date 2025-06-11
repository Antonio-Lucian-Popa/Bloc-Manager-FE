import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { RepairRequest } from '@/types';
import { CreateRepairRequestModal } from '@/components/modals/CreateRepairRequestModal';
import { Plus, Wrench, MapPin, Calendar, User, AlertTriangle } from 'lucide-react';

export function RepairRequestsPage() {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const canCreateRequests = user?.role === 'LOCATAR';

  useEffect(() => {
    loadRepairRequests();
  }, []);

  const loadRepairRequests = async () => {
    try {
      const data = await apiService.getRepairRequests();
      setRepairRequests(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca sesizările.',
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
          <Wrench className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.original.description}</span>
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Locația',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.original.location}</span>
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Prioritate',
      cell: ({ row }: any) => {
        const priority = row.original.priority;
        const variant = priority === 'HIGH' ? 'destructive' : priority === 'MEDIUM' ? 'secondary' : 'outline';
        const icon = priority === 'HIGH' ? <AlertTriangle className="h-3 w-3" /> : null;
        const text = priority === 'HIGH' ? 'Urgentă' : priority === 'MEDIUM' ? 'Medie' : 'Scăzută';
        
        return (
          <div className="flex items-center space-x-1">
            {icon}
            <Badge variant={variant}>{text}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const variant = status === 'COMPLETED' ? 'success' : 
                      status === 'IN_PROGRESS' ? 'secondary' : 
                      status === 'REJECTED' ? 'destructive' : 'outline';
        const text = status === 'COMPLETED' ? 'Finalizat' : 
                    status === 'IN_PROGRESS' ? 'În lucru' : 
                    status === 'REJECTED' ? 'Respins' : 'Pending';
        return <Badge variant={variant}>{text}</Badge>;
      },
    },
    {
      accessorKey: 'tenantName',
      header: 'Solicitant',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{row.original.tenantName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Data Sesizării',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.original.createdAt).toLocaleDateString('ro-RO')}</span>
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
          <h1 className="text-3xl font-bold text-gray-900">
            {canCreateRequests ? 'Sesizările Mele' : 'Sesizări de Reparații'}
          </h1>
          <p className="text-gray-600 mt-1">
            {canCreateRequests 
              ? 'Gestionați sesizările dvs. de reparații' 
              : 'Vizualizați toate sesizările de reparații'
            }
          </p>
        </div>
        {canCreateRequests && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Sesizare Nouă
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Sesizărilor</CardTitle>
          <CardDescription>
            {canCreateRequests 
              ? 'Sesizările dvs. de reparații și statusul lor' 
              : 'Toate sesizările de reparații din bloc'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={repairRequests}
            searchKey="description"
            searchPlaceholder="Căutați după descrierea sesizării..."
          />
        </CardContent>
      </Card>

      {canCreateRequests && (
        <CreateRepairRequestModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadRepairRequests}
        />
      )}
    </div>
  );
}