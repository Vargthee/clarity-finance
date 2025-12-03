import { useState, useMemo } from "react";
import { useTransactions } from "@/contexts/TransactionsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { subDays, format, isAfter } from "date-fns";

const COLORS = {
  Food: "#fb923c",
  Rent: "#a855f7",
  Transport: "#3b82f6",
  Entertainment: "#ec4899",
  Shopping: "#f59e0b",
  Salary: "#10b981",
};

const Analytics = () => {
  const { transactions } = useTransactions();
  const [timeRange, setTimeRange] = useState<"30days" | "ytd">("30days");

  // Filter transactions by time range
  const filteredTransactions = useMemo(() => {
    const cutoffDate =
      timeRange === "30days"
        ? subDays(new Date(), 30)
        : new Date(new Date().getFullYear(), 0, 1);

    return transactions.filter((t) => isAfter(new Date(t.date), cutoffDate));
  }, [transactions, timeRange]);

  // Monthly spending trend data
  const monthlyTrendData = useMemo(() => {
    const dataMap = new Map<string, { income: number; expenses: number }>();

    filteredTransactions.forEach((t) => {
      const monthKey = format(new Date(t.date), "MMM dd");
      const current = dataMap.get(monthKey) || { income: 0, expenses: 0 };

      if (t.type === "income") {
        current.income += t.amount;
      } else {
        current.expenses += Math.abs(t.amount);
      }

      dataMap.set(monthKey, current);
    });

    return Array.from(dataMap.entries())
      .map(([date, values]) => ({
        date,
        income: values.income,
        expenses: values.expenses,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 data points
  }, [filteredTransactions]);

  // Category breakdown data
  const categoryData = useMemo(() => {
    const categoryTotals = new Map<string, number>();

    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + Math.abs(t.amount));
      });

    return Array.from(categoryTotals.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredTransactions]);

  // Summary stats
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      income,
      expenses,
      savings: income - expenses,
    };
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Visualize your spending patterns and trends
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value: "30days" | "ytd") => setTimeRange(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-income">
              ₦{stats.income.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-expense">
              ₦{stats.expenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Net Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stats.savings >= 0 ? "text-income" : "text-expense"}`}>
              ₦{stats.savings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Spending Trend */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
                <YAxis className="text-xs" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(var(--income))"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--expense))"
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
