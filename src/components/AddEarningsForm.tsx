import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddEarningsFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AddEarningsForm({ onBack, onSuccess }: AddEarningsFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    earnings_amount: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.earnings_amount) {
      toast({
        title: "Error",
        description: "Please enter the earnings amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const earningsData = {
        date: formData.date,
        earnings_amount: parseFloat(formData.earnings_amount),
        notes: formData.notes || null
      };

      const { error } = await supabase
        .from('daily_earnings')
        .upsert([earningsData], { 
          onConflict: 'date',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Daily earnings saved successfully"
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save earnings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add Daily Earnings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="earnings_amount">Earnings Amount (₹) *</Label>
              <Input
                id="earnings_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.earnings_amount}
                onChange={(e) => handleInputChange('earnings_amount', e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about today's earnings (optional)"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 h-12">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Earnings'}
              </Button>
              <Button type="button" variant="outline" onClick={onBack} className="h-12">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}