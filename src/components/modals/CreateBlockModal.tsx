import React, { useState, useEffect } from 'react';
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
import { Association } from '@/types';
import { Loader2 } from 'lucide-react';
import { getAssociations } from '@/services/associationService';
import { createBlock } from '@/services/blocService';

interface CreateBlockModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBlockModal({
  open,
  onClose,
  onSuccess,
}: CreateBlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    associationId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadAssociations();
    }
  }, [open]);

  const loadAssociations = async () => {
    try {
      const data = await getAssociations();
      setAssociations(data.content);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca asociațiile.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.associationId) {
      toast({
        title: 'Eroare',
        description: 'Toate câmpurile sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createBlock(formData.associationId, {
        name: formData.name,
        address: formData.address,
        associationId: formData.associationId
      });

      toast({
        title: 'Success',
        description: 'Blocul a fost creat cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ name: '', address: '', associationId: '' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut crea blocul.',
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
          <DialogTitle>Bloc Nou</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a crea un nou bloc în cadrul unei asociații.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="associationId">Asociația *</Label>
            <Select
              value={formData.associationId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, associationId: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați asociația" />
              </SelectTrigger>
              <SelectContent>
                {associations?.length ? (
                  associations.map((association) => (
                    <SelectItem key={association.id} value={association.id}>
                      {association.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    Nu există asociații disponibile
                  </div>
                )}
              </SelectContent>

            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Numele Blocului *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="ex: Bloc A1, Scara 1"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresa *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Adresa completă a blocului"
              disabled={loading}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Creează Blocul
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}