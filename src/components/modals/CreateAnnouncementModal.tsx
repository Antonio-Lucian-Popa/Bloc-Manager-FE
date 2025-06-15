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
import { getBlocks } from '@/services/blocService';
import { createAnnouncement } from '@/services/announcementService';

interface CreateAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAnnouncementModal({
  open,
  onClose,
  onSuccess,
}: CreateAnnouncementModalProps) {
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: '',
    blockId: '',
  });
  const { toast } = useToast();

  const priorities = [
    { value: 'LOW', label: 'Scăzută' },
    { value: 'MEDIUM', label: 'Medie' },
    { value: 'HIGH', label: 'Înaltă' },
  ];

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
    if (!formData.title || !formData.content || !formData.priority || !formData.blockId) {
      toast({
        title: 'Eroare',
        description: 'Toate câmpurile sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createAnnouncement({
        ...formData,
        priority: formData.priority as "LOW" | "MEDIUM" | "HIGH",
      });
      
      toast({
        title: 'Success',
        description: 'Anunțul a fost creat cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ title: '', content: '', priority: '', blockId: '' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut crea anunțul.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Anunț Nou</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a crea un nou anunț pentru bloc.
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
            <Label htmlFor="title">Titlul *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Titlul anunțului"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritatea *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați prioritatea" />
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

          <div className="space-y-2">
            <Label htmlFor="content">Conținutul *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Conținutul complet al anunțului"
              disabled={loading}
              rows={6}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publică Anunțul
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}