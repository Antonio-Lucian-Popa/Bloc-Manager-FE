import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { inviteUser } from '@/services/userService';
import { Role, UserRole } from '@/types';

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteUserModal({
  open,
  onClose,
  onSuccess,
}: InviteUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  }>({
    email: '',
    firstName: '',
    lastName: '',
    role: Role.ADMIN_ASSOCIATION,
  });
  const { toast } = useToast();

  const roles = [
    { value: Role.ADMIN_ASSOCIATION, label: 'Admin Asociație' },
    { value: Role.BLOCK_ADMIN, label: 'Admin Bloc' },
    { value: Role.LOCATAR, label: 'Locatar' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      toast({
        title: 'Eroare',
        description: 'Toate câmpurile sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await inviteUser(formData);
      toast({
        title: 'Success',
        description: 'Invitația a fost trimisă cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ email: '', firstName: '', lastName: '', role: Role.ADMIN_ASSOCIATION });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut trimite invitația.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invită Utilizator</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a invita un nou utilizator în sistem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="utilizator@email.com"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenume *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="Ion"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nume *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Popescu"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value as Role }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați rolul" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Trimite Invitația
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}