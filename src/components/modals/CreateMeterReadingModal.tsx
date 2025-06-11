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
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Apartment } from '@/types';
import { Loader2 } from 'lucide-react';

interface CreateMeterReadingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateMeterReadingModal({
  open,
  onClose,
  onSuccess,
}: CreateMeterReadingModalProps) {
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [formData, setFormData] = useState({
    apartmentId: '',
    meterType: '',
    currentReading: '',
    previousReading: '',
    readingDate: '',
  });
  const { toast } = useToast();

  const meterTypes = [
    { value: 'WATER', label: 'Apă' },
    { value: 'GAS', label: 'Gaz' },
    { value: 'ELECTRICITY', label: 'Electricitate' },
  ];

  useEffect(() => {
    if (open) {
      loadApartments();
      setFormData(prev => ({ ...prev, readingDate: new Date().toISOString().split('T')[0] }));
    }
  }, [open]);

  const loadApartments = async () => {
    try {
      const data = await apiService.getApartments();
      setApartments(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca apartamentele.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.apartmentId || !formData.meterType || !formData.currentReading || !formData.readingDate) {
      toast({
        title: 'Eroare',
        description: 'Apartamentul, tipul contorului, citirea curentă și data sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await apiService.createMeterReading({
        apartmentId: formData.apartmentId,
        meterType: formData.meterType,
        currentReading: parseFloat(formData.currentReading),
        previousReading: formData.previousReading ? parseFloat(formData.previousReading) : undefined,
        readingDate: formData.readingDate,
      });
      
      toast({
        title: 'Success',
        description: 'Citirea a fost înregistrată cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ apartmentId: '', meterType: '', currentReading: '', previousReading: '', readingDate: '' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut înregistra citirea.',
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
          <DialogTitle>Citire Contor Nouă</DialogTitle>
          <DialogDescription>
            Completați informațiile pentru a înregistra o nouă citire de contor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apartmentId">Apartamentul *</Label>
            <Select
              value={formData.apartmentId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, apartmentId: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați apartamentul" />
              </SelectTrigger>
              <SelectContent>
                {apartments.map((apartment) => (
                  <SelectItem key={apartment.id} value={apartment.id}>
                    Ap. {apartment.number} - {apartment.blockName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meterType">Tipul Contorului *</Label>
            <Select
              value={formData.meterType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, meterType: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați tipul" />
              </SelectTrigger>
              <SelectContent>
                {meterTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentReading">Citirea Curentă *</Label>
              <Input
                id="currentReading"
                type="number"
                step="0.1"
                value={formData.currentReading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currentReading: e.target.value }))
                }
                placeholder="1250.5"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousReading">Citirea Anterioară</Label>
              <Input
                id="previousReading"
                type="number"
                step="0.1"
                value={formData.previousReading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, previousReading: e.target.value }))
                }
                placeholder="1150.2"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="readingDate">Data Citirii *</Label>
            <Input
              id="readingDate"
              type="date"
              value={formData.readingDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, readingDate: e.target.value }))
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
              Înregistrează Citirea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}