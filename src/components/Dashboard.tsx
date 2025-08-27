import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Plus, Receipt, FileText, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  todayEarnings: number;
  totalPayments: number;
  remainingBalance: number;
  todayPayments: number;
}

interface DashboardProps {
  onAddPayment: () => void;
  onAddEarnings: () => void;
  onAddNote: () => void;
}

export default function Dashboard({ onAddPayment, onAddEarnings, onAddNote }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    todayEarnings: 0,
    totalPayments: 0,
    remainingBalance: 0,
    todayPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's earnings
      const { data: earningsData } = await supabase
        .from('daily_earnings')
        .select('earnings_amount')
        .eq('date', today)
        .single();

      // Get today's payments
      const { data: todayPaymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('date', today);

      // Get total payments
      const { data: totalPaymentsData } = await supabase
        .from('payments')
        .select('amount');

      const todayEarnings = earningsData?.earnings_amount || 0;
      const todayPaymentsSum = todayPaymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const totalPaymentsSum = totalPaymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const remainingBalance = todayEarnings - todayPaymentsSum;

      setStats({
        todayEarnings,
        totalPayments: totalPaymentsSum,
        remainingBalance,
        todayPayments: todayPaymentsSum
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{value.toFixed(2)}</div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Finance Tracker</h1>
        <p className="text-muted-foreground">Track payments and earnings for your shop</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Earnings"
          value={stats.todayEarnings}
          icon={TrendingUp}
          color="text-finance-success"
        />
        <StatCard
          title="Today's Payments"
          value={stats.todayPayments}
          icon={Receipt}
          color="text-finance-warning"
        />
        <StatCard
          title="Remaining Balance"
          value={stats.remainingBalance}
          icon={DollarSign}
          color={stats.remainingBalance >= 0 ? "text-finance-success" : "text-destructive"}
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={FileText}
          color="text-primary"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              onClick={onAddPayment} 
              className="h-14 text-base font-medium"
              size="lg"
            >
              <Receipt className="mr-2 h-5 w-5" />
              Add Payment
            </Button>
            <Button 
              onClick={onAddEarnings} 
              variant="outline" 
              className="h-14 text-base font-medium"
              size="lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Add Earnings
            </Button>
            <Button 
              onClick={onAddNote} 
              variant="outline" 
              className="h-14 text-base font-medium"
              size="lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}