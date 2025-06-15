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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createRepairRequest } from '@/services/repairRequestService';

interface CreateRepairRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRepairRequestModal({
  open,
  onClose,
  onSuccess,
}: CreateRepairRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    priority: 'MEDIUM',
  });
  const { toast } = useToast();

  const priorities = [
    { value: 'LOW', label: 'Scăzută' },
    { value: 'MEDIUM', label: 'Medie' },
    { value: 'HIGH', label: 'Urgentă' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.location) {
      toast({
        title: 'Eroare',
        description: 'Descrierea și locația sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, using hardcoded IDs
      await createRepairRequest({
        ...formData,
        priority: formData.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        apartmentId: '1', // This would come from the current user's apartment
        blockId: '1',
        status: 'PENDING'
      });
      
      toast({
        title: 'Success',
        description: 'Sesizarea a fost trimisă cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ description: '', location: '', priority: 'MEDIUM' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut trimite sesizarea.',
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
          <DialogTitle>Sesizare Nouă</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a trimite o nouă sesizare de reparații.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrierea Problemei *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descrieți detaliat problema întâlnită"
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Locația *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="ex: Baie, Bucătărie, Balcon, etc."
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritatea</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
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
              Trimite Sesizarea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}