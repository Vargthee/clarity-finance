import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useMemo } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";
import { useTransactions } from "@/contexts/TransactionsContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { transactions } = useTransactions();

  // Calculate totals
  const { totalBalance, monthlyIncome, monthlyExpenses } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: balance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
    };
  }, [transactions]);

  // Get recent 5 transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((t) => ({
        ...t,
        date: new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));
  }, [transactions]);

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <AddTransactionDialog trigger={
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Plus className="mr-2 h-5 w-5" />
            Add Transaction
          </Button>
        } />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={`₦${totalBalance.toLocaleString()}`}
          icon={Wallet}
          variant="default"
        />
        <SummaryCard
          title="Monthly Income"
          amount={`₦${monthlyIncome.toLocaleString()}`}
          icon={TrendingUp}
          variant="income"
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={`₦${monthlyExpenses.toLocaleString()}`}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>
        <TransactionsTable transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Index;
