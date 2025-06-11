import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Announcement } from '@/types';
import { CreateAnnouncementModal } from '@/components/modals/CreateAnnouncementModal';
import { Plus, MessageSquare, Calendar, User, AlertTriangle } from 'lucide-react';

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const canCreateAnnouncements = user?.role === 'BLOCK_ADMIN' || user?.role === 'ADMIN_ASSOCIATION';

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await apiService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca anunțurile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Titlu',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Conținut',
      cell: ({ row }: any) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-600 truncate">
            {row.original.content}
          </p>
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
      accessorKey: 'blockName',
      header: 'Blocul',
      cell: ({ row }: any) => (
        <Badge variant="secondary">{row.original.blockName}</Badge>
      ),
    },
    {
      accessorKey: 'authorName',
      header: 'Autor',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{row.original.authorName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Data Publicării',
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
          <h1 className="text-3xl font-bold text-gray-900">Anunțuri</h1>
          <p className="text-gray-600 mt-1">
            {canCreateAnnouncements 
              ? 'Gestionați anunțurile pentru bloc' 
              : 'Vizualizați anunțurile din bloc'
            }
          </p>
        </div>
        {canCreateAnnouncements && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Anunț Nou
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Anunțurilor</CardTitle>
          <CardDescription>
            {canCreateAnnouncements 
              ? 'Toate anunțurile publicate în bloc' 
              : 'Anunțurile importante din blocul dvs.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={announcements}
            searchKey="title"
            searchPlaceholder="Căutați după titlul anunțului..."
          />
        </CardContent>
      </Card>

      {canCreateAnnouncements && (
        <CreateAnnouncementModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadAnnouncements}
        />
      )}
    </div>
  );
}