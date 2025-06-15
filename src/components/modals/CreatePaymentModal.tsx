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
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { ApartmentExpense } from '@/types';
import { Loader2 } from 'lucide-react';
import { createPayment } from '@/services/paymentService';

interface CreatePaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pendingExpenses: ApartmentExpense[];
}

export function CreatePaymentModal({
  open,
  onClose,
  onSuccess,
  pendingExpenses,
}: CreatePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    expenseId: string;
    amount: string;
    method: 'CARD' | 'TRANSFER' | 'CASH';
    reference: string;
  }>({
    expenseId: '',
    amount: '',
    method: 'CARD',
    reference: '',
  });
  const { toast } = useToast();

  const paymentMethods = [
    { value: 'CARD', label: 'Card bancar' },
    { value: 'TRANSFER', label: 'Transfer bancar' },
    { value: 'CASH', label: 'Numerar' },
  ];

  const selectedExpense = pendingExpenses.find(e => e.id === formData.expenseId);

  const handleExpenseSelect = (expenseId: string) => {
    const expense = pendingExpenses.find(e => e.id === expenseId);
    setFormData(prev => ({
      ...prev,
      expenseId,
      amount: expense ? expense.amount.toString() : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.expenseId || !formData.amount || !formData.method) {
      toast({
        title: 'Eroare',
        description: 'Cheltuiala, suma și metoda de plată sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createPayment({
        apartmentId: '1', // This would come from the current user's apartment
        expenseId: formData.expenseId,
        amount: parseFloat(formData.amount),
        method: formData.method,
        reference: formData.reference,
      });
      
      toast({
        title: 'Success',
        description: 'Plata a fost înregistrată cu succes.',
      });
      onSuccess();
      onClose();
      setFormData({ expenseId: '', amount: '', method: 'CARD', reference: '' });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut înregistra plata.',
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
          <DialogTitle>Efectuează Plată</DialogTitle>
          <DialogDescription>
            Selectați cheltuiala și completați informațiile de plată.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expenseId">Cheltuiala de Plătit *</Label>
            <Select
              value={formData.expenseId}
              onValueChange={handleExpenseSelect}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați cheltuiala" />
              </SelectTrigger>
              <SelectContent>
                {pendingExpenses.map((expense) => (
                  <SelectItem key={expense.id} value={expense.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{expense.expense.description}</span>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className="font-medium">{expense.amount} RON</span>
                        <Badge variant={expense.status === 'OVERDUE' ? 'destructive' : 'secondary'}>
                          {expense.status === 'OVERDUE' ? 'Întârziat' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedExpense && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Descriere:</span>
                <span className="text-sm font-medium">{selectedExpense.expense.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sumă:</span>
                <span className="text-sm font-medium">{selectedExpense.amount} RON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Scadență:</span>
                <span className="text-sm font-medium">
                  {new Date(selectedExpense.dueDate).toLocaleDateString('ro-RO')}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Suma de Plată (RON) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="0.00"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Metoda de Plată *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, method: value as 'CARD' | 'TRANSFER' | 'CASH' }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referința Plății</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reference: e.target.value }))
              }
              placeholder="Număr tranzacție, referință, etc."
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmă Plata
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}