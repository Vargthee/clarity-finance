import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionsTable, Transaction } from "@/components/dashboard/TransactionsTable";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "Dec 15, 2025",
    description: "Monthly Salary",
    category: "Salary",
    amount: 5000,
    type: "income",
  },
  {
    id: "2",
    date: "Dec 14, 2025",
    description: "Grocery Shopping",
    category: "Food",
    amount: -120.50,
    type: "expense",
  },
  {
    id: "3",
    date: "Dec 12, 2025",
    description: "Monthly Rent",
    category: "Rent",
    amount: -1200,
    type: "expense",
  },
  {
    id: "4",
    date: "Dec 10, 2025",
    description: "Uber Ride",
    category: "Transport",
    amount: -25.30,
    type: "expense",
  },
  {
    id: "5",
    date: "Dec 8, 2025",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: -35,
    type: "expense",
  },
];

const Index = () => {
  const totalBalance = 8650.20;
  const monthlyIncome = 5000;
  const monthlyExpenses = 1380.80;

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <AddTransactionDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={`$${totalBalance.toFixed(2)}`}
          icon={Wallet}
          variant="default"
        />
        <SummaryCard
          title="Monthly Income"
          amount={`$${monthlyIncome.toFixed(2)}`}
          icon={TrendingUp}
          variant="income"
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={`$${monthlyExpenses.toFixed(2)}`}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>
        <TransactionsTable transactions={mockTransactions} />
      </div>
    </div>
  );
};

export default Index;
