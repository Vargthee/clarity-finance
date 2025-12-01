import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactions } from "@/contexts/TransactionsContext";

interface EditBudgetDialogProps {
  budgetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBudgetDialog({
  budgetId,
  open,
  onOpenChange,
}: EditBudgetDialogProps) {
  const { budgets, updateBudget } = useTransactions();
  const budget = budgets.find((b) => b.id === budgetId);

  const [limit, setLimit] = useState("");

  useEffect(() => {
    if (budget) {
      setLimit(budget.limit.toString());
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numLimit = parseFloat(limit);
    if (numLimit > 0) {
      updateBudget(budgetId, numLimit);
      onOpenChange(false);
    }
  };

  if (!budget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget Limit</DialogTitle>
          <DialogDescription>
            Update the budget limit for {budget.category}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="limit">Budget Limit ($)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Current spending: <span className="font-semibold text-foreground">${budget.spent.toFixed(2)}</span>
            </p>
          </div>

          <Button type="submit" className="w-full">
            Update Budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
