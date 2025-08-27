import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddNoteFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AddNoteForm({ onBack, onSuccess }: AddNoteFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter note content",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const noteData = {
        date: formData.date,
        content: formData.content.trim()
      };

      const { error } = await supabase
        .from('notes')
        .insert([noteData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note added successfully"
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note",
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
        <h1 className="text-2xl font-bold">Add Note</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Note Details</CardTitle>
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
              <Label htmlFor="content">Note Content *</Label>
              <Textarea
                id="content"
                placeholder="Enter your note here..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                required
                className="min-h-[150px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 h-12">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Note'}
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