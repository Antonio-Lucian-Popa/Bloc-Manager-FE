import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { InviteUserModal } from '@/components/modals/InviteUserModal';
import { Plus, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { getUsers } from '@/services/userService';
import { getAssociations } from '@/services/associationService';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
       const associations = await getAssociations();
      if (associations.length === 0) return;
      const data = await getUsers(associations[0].id);
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca utilizatorii.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN_ASSOCIATION':
        return 'Admin Asociație';
      case 'BLOCK_ADMIN':
        return 'Admin Bloc';
      case 'LOCATAR':
        return 'Locatar';
      default:
        return role;
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'ADMIN_ASSOCIATION':
        return 'destructive';
      case 'BLOCK_ADMIN':
        return 'secondary';
      case 'LOCATAR':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Utilizator',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {getInitials(row.original.firstName, row.original.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <Badge variant={getRoleVariant(row.original.role.role)}>
            {getRoleLabel(row.original.role.role)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Data Înregistrării',
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
          <h1 className="text-3xl font-bold text-gray-900">Utilizatori</h1>
          <p className="text-gray-600 mt-1">
            Gestionați utilizatorii din sistem
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invită Utilizator
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Utilizatorilor</CardTitle>
          <CardDescription>
            Toți utilizatorii înregistrați în sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="email"
            searchPlaceholder="Căutați după email..."
          />
        </CardContent>
      </Card>

      <InviteUserModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
}