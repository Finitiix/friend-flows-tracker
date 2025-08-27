import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import AddPaymentForm from '@/components/AddPaymentForm';
import AddEarningsForm from '@/components/AddEarningsForm';
import AddNoteForm from '@/components/AddNoteForm';
import HistoryPage from '@/components/HistoryPage';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

type View = 'dashboard' | 'add-payment' | 'add-earnings' | 'add-note' | 'history';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingPayment, setEditingPayment] = useState<any>(null);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    if (view !== 'add-payment') {
      setEditingPayment(null);
    }
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setCurrentView('add-payment');
  };

  const handleFormSuccess = () => {
    setCurrentView('dashboard');
    setEditingPayment(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with navigation */}
        {currentView === 'dashboard' && (
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button
              variant="outline"
              onClick={() => handleViewChange('history')}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              View History
            </Button>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'dashboard' && (
          <Dashboard
            onAddPayment={() => handleViewChange('add-payment')}
            onAddEarnings={() => handleViewChange('add-earnings')}
            onAddNote={() => handleViewChange('add-note')}
          />
        )}

        {currentView === 'add-payment' && (
          <AddPaymentForm
            onBack={() => handleViewChange('dashboard')}
            onSuccess={handleFormSuccess}
            editingPayment={editingPayment}
          />
        )}

        {currentView === 'add-earnings' && (
          <AddEarningsForm
            onBack={() => handleViewChange('dashboard')}
            onSuccess={handleFormSuccess}
          />
        )}

        {currentView === 'add-note' && (
          <AddNoteForm
            onBack={() => handleViewChange('dashboard')}
            onSuccess={handleFormSuccess}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage
            onBack={() => handleViewChange('dashboard')}
            onEditPayment={handleEditPayment}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          Powered By Finitix
        </footer>
      </div>
    </div>
  );
};

export default Index;
