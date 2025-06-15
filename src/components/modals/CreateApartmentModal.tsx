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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Block } from '@/types';
import { Loader2 } from 'lucide-react';
import { getBlocks } from '@/services/blocService';
import { createApartment } from '@/services/apartmentService';

interface CreateApartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateApartmentModal({
  open,
  onClose,
  onSuccess,
}: CreateApartmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [formData, setFormData] = useState({
    number: '',
    floor: '',
    area: '',
    blockId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadBlocks();
    }
  }, [open]);

  const loadBlocks = async () => {
    try {
      const data = await getBlocks();
      setBlocks(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca blocurile.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number || !formData.floor || !formData.area || !formData.blockId) {
      toast({
        title: 'Eroare',
        description: 'Toate câmpurile sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createApartment(formData.blockId, {
        number: formData.number,
        floor: parseInt(formData.floor),
        area: parseFloat(formData.area),
        blockId: formData.blockId
      });
      
      toast({
        title: 'Success',
        description: 'Apartamentul a fost creat cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ number: '', floor: '', area: '', blockId: '' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut crea apartamentul.',
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
          <DialogTitle>Apartament Nou</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a crea un nou apartament.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blockId">Blocul *</Label>
            <Select
              value={formData.blockId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, blockId: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați blocul" />
              </SelectTrigger>
              <SelectContent>
                {blocks.map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name} - {block.associationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Numărul *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, number: e.target.value }))
                }
                placeholder="ex: 23"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Etajul *</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, floor: e.target.value }))
                }
                placeholder="ex: 2"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Suprafața (mp) *</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                value={formData.area}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, area: e.target.value }))
                }
                placeholder="ex: 65.5"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Creează Apartamentul
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}