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
import { Block } from '@/types';
import { Loader2 } from 'lucide-react';
import { getBlocks, getBlocksList } from '@/services/blocService';
import { createExpense } from '@/services/expenseService';
import { getAssociations } from '@/services/associationService';

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateExpenseModal({
  open,
  onClose,
  onSuccess,
}: CreateExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    blockId: '',
    dueDate: '',
  });
  const { toast } = useToast();

  const categories = [{
    key: 'Întreținere',
    value: 'Întreținere',
  },
  {
    key: 'Reparații',
    value: 'Reparații',
  },
  {
    key: 'Curățenie',
    value: 'Curățenie',
  },
  {
    key: 'Utilități',
    value: 'Utilități',
  },
  {
    key: 'Administrare',
    value: 'Administrare',
  },
  {
    key: 'Fond de reparații',
    value: 'Fond_de_reparații',
  },
  {
    key: 'Alte cheltuieli',
    value: 'Alte_cheltuieli',
  }
  ];

  useEffect(() => {
    if (open) {
      loadBlocks();
    }
  }, [open]);

  const loadBlocks = async () => {
    try {
      const associations = await getAssociations();
      const data = await getBlocksList(associations.content[0].id);
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
    if (!formData.description || !formData.amount || !formData.category || !formData.blockId || !formData.dueDate) {
      toast({
        title: 'Eroare',
        description: 'Toate câmpurile sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        blockId: formData.blockId,
        dueDate: formData.dueDate,
      });
      
      toast({
        title: 'Success',
        description: 'Cheltuiala a fost creată cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ description: '', amount: '', category: '', blockId: '', dueDate: '' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut crea cheltuiala.',
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
          <DialogTitle>Cheltuială Nouă</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a crea o nouă cheltuială pentru bloc.
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

          <div className="space-y-2">
            <Label htmlFor="description">Descrierea *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descrierea detaliată a cheltuielii"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Suma (RON) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="1500.00"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectați categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.key} value={category.value}>
                      {category.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data Scadenței *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Creează Cheltuiala
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}