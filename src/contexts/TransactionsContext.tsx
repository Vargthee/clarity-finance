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

interface TransactionsContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (id: string, limit: number) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Initial mock data
const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-12-15",
    description: "Monthly Salary",
    category: "Salary",
    amount: 5000,
    type: "income",
  },
  {
    id: "2",
    date: "2025-12-14",
    description: "Grocery Shopping",
    category: "Food",
    amount: -120.50,
    type: "expense",
  },
  {
    id: "3",
    date: "2025-12-12",
    description: "Monthly Rent",
    category: "Rent",
    amount: -1200,
    type: "expense",
  },
  {
    id: "4",
    date: "2025-12-10",
    description: "Uber Ride",
    category: "Transport",
    amount: -25.30,
    type: "expense",
  },
  {
    id: "5",
    date: "2025-12-08",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: -35,
    type: "expense",
  },
  {
    id: "6",
    date: "2025-11-28",
    description: "Freelance Project",
    category: "Salary",
    amount: 800,
    type: "income",
  },
  {
    id: "7",
    date: "2025-11-25",
    description: "Restaurant Dinner",
    category: "Food",
    amount: -85.20,
    type: "expense",
  },
  {
    id: "8",
    date: "2025-11-20",
    description: "New Shoes",
    category: "Shopping",
    amount: -120,
    type: "expense",
  },
  {
    id: "9",
    date: "2025-11-15",
    description: "Monthly Salary",
    category: "Salary",
    amount: 5000,
    type: "income",
  },
  {
    id: "10",
    date: "2025-11-12",
    description: "Monthly Rent",
    category: "Rent",
    amount: -1200,
    type: "expense",
  },
  {
    id: "11",
    date: "2025-11-08",
    description: "Gas Station",
    category: "Transport",
    amount: -60,
    type: "expense",
  },
  {
    id: "12",
    date: "2025-11-05",
    description: "Streaming Subscriptions",
    category: "Entertainment",
    amount: -45,
    type: "expense",
  },
];

const initialBudgets: Budget[] = [
  { id: "1", category: "Food", limit: 500, spent: 205.70, icon: "🍔" },
  { id: "2", category: "Rent", limit: 1200, spent: 1200, icon: "🏠" },
  { id: "3", category: "Transport", limit: 200, spent: 85.30, icon: "🚗" },
  { id: "4", category: "Entertainment", limit: 150, spent: 80, icon: "🎬" },
  { id: "5", category: "Shopping", limit: 300, spent: 120, icon: "🛍️" },
];

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

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
      description: `${transaction.type === "income" ? "Income" : "Expense"} of $${Math.abs(transaction.amount).toFixed(2)} has been added`,
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

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
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
