import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (id: string, limit: number) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, goal: Omit<Goal, "id">) => void;
  deleteGoal: (id: string) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Initial mock data with realistic Nigerian Naira amounts
const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-12-15",
    description: "Monthly Salary",
    category: "Salary",
    amount: 650000,
    type: "income",
  },
  {
    id: "2",
    date: "2025-12-14",
    description: "Grocery Shopping",
    category: "Food",
    amount: -45000,
    type: "expense",
  },
  {
    id: "3",
    date: "2025-12-12",
    description: "Monthly Rent",
    category: "Rent",
    amount: -180000,
    type: "expense",
  },
  {
    id: "4",
    date: "2025-12-10",
    description: "Bolt Ride",
    category: "Transport",
    amount: -3500,
    type: "expense",
  },
  {
    id: "5",
    date: "2025-12-08",
    description: "Cinema Tickets",
    category: "Entertainment",
    amount: -8000,
    type: "expense",
  },
  {
    id: "6",
    date: "2025-11-28",
    description: "Freelance Project",
    category: "Salary",
    amount: 150000,
    type: "income",
  },
  {
    id: "7",
    date: "2025-11-25",
    description: "Restaurant Dinner",
    category: "Food",
    amount: -25000,
    type: "expense",
  },
  {
    id: "8",
    date: "2025-11-20",
    description: "New Shoes",
    category: "Shopping",
    amount: -35000,
    type: "expense",
  },
  {
    id: "9",
    date: "2025-11-15",
    description: "Monthly Salary",
    category: "Salary",
    amount: 650000,
    type: "income",
  },
  {
    id: "10",
    date: "2025-11-12",
    description: "Monthly Rent",
    category: "Rent",
    amount: -180000,
    type: "expense",
  },
  {
    id: "11",
    date: "2025-11-08",
    description: "Fuel",
    category: "Transport",
    amount: -25000,
    type: "expense",
  },
  {
    id: "12",
    date: "2025-11-05",
    description: "Streaming Subscriptions",
    category: "Entertainment",
    amount: -12000,
    type: "expense",
  },
];

const initialBudgets: Budget[] = [
  { id: "1", category: "Food", limit: 100000, spent: 70000, icon: "🍔" },
  { id: "2", category: "Rent", limit: 200000, spent: 180000, icon: "🏠" },
  { id: "3", category: "Transport", limit: 50000, spent: 28500, icon: "🚗" },
  { id: "4", category: "Entertainment", limit: 30000, spent: 20000, icon: "🎬" },
  { id: "5", category: "Shopping", limit: 80000, spent: 35000, icon: "🛍️" },
];

const initialGoals: Goal[] = [
  { id: "1", title: "Emergency Fund", targetAmount: 2000000, currentAmount: 750000, icon: "🎯" },
  { id: "2", title: "Trip to Dubai", targetAmount: 1500000, currentAmount: 400000, deadline: "2026-06-01", icon: "✈️" },
  { id: "3", title: "New Laptop", targetAmount: 800000, currentAmount: 650000, icon: "💻" },
];

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update budget if it's an expense
    if (transaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === transaction.category
            ? { ...budget, spent: budget.spent + Math.abs(transaction.amount) }
            : budget
        )
      );
    }

    toast({
      title: "Transaction added",
      description: `${transaction.type === "income" ? "Income" : "Expense"} of ₦${Math.abs(transaction.amount).toLocaleString()} has been added`,
    });
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, "id">) => {
    const oldTransaction = transactions.find((t) => t.id === id);
    
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...updatedTransaction, id } : transaction
      )
    );

    // Update budgets
    if (oldTransaction && oldTransaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === oldTransaction.category
            ? { ...budget, spent: budget.spent - Math.abs(oldTransaction.amount) }
            : budget
        )
      );
    }

    if (updatedTransaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === updatedTransaction.category
            ? { ...budget, spent: budget.spent + Math.abs(updatedTransaction.amount) }
            : budget
        )
      );
    }

    toast({
      title: "Transaction updated",
      description: "Your transaction has been updated successfully",
    });
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Update budget if it was an expense
    if (transaction && transaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === transaction.category
            ? { ...budget, spent: budget.spent - Math.abs(transaction.amount) }
            : budget
        )
      );
    }

    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed",
      variant: "destructive",
    });
  };

  const updateBudget = (id: string, limit: number) => {
    setBudgets((prev) =>
      prev.map((budget) => (budget.id === id ? { ...budget, limit } : budget))
    );

    toast({
      title: "Budget updated",
      description: "Your budget limit has been updated",
    });
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals((prev) => [newGoal, ...prev]);

    toast({
      title: "Goal created",
      description: `Your goal "${goal.title}" has been created`,
    });
  };

  const updateGoal = (id: string, updatedGoal: Omit<Goal, "id">) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...updatedGoal, id } : goal))
    );

    toast({
      title: "Goal updated",
      description: "Your goal has been updated successfully",
    });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));

    toast({
      title: "Goal deleted",
      description: "The goal has been removed",
      variant: "destructive",
    });
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
}
