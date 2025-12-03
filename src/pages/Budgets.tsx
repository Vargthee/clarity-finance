import { useState } from "react";
import { useTransactions } from "@/contexts/TransactionsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditBudgetDialog } from "@/components/budgets/EditBudgetDialog";

const Budgets = () => {
  const { budgets } = useTransactions();
  const [editingBudget, setEditingBudget] = useState<string | null>(null);

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-expense";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-income";
  };

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Budgets</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Track your spending against budget limits
        </p>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {budgets.map((budget) => {
          const percentage = getProgressPercentage(budget.spent, budget.limit);
          const isOverBudget = budget.spent >= budget.limit;
          const isWarning = percentage >= 70 && !isOverBudget;

          return (
            <Card
              key={budget.id}
              className={`shadow-card hover:shadow-lg transition-all ${
                isOverBudget ? "border-expense/50" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{budget.icon}</span>
                    <CardTitle className="text-xl">{budget.category}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingBudget(budget.id)}
                    className="hover:bg-accent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-semibold">
                      ₦{budget.spent.toLocaleString()} / ₦{budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-3 ${getProgressColor(budget.spent, budget.limit)}`}
                  />
                </div>

                <div className="pt-2">
                  {isOverBudget ? (
                    <div className="text-sm font-medium text-expense">
                      ⚠️ Over budget by ₦{(budget.spent - budget.limit).toLocaleString()}
                    </div>
                  ) : isWarning ? (
                    <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      ⚠️ {(100 - percentage).toFixed(0)}% remaining
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-income">
                      ✓ {(100 - percentage).toFixed(0)}% remaining
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Budget Dialog */}
      {editingBudget && (
        <EditBudgetDialog
          budgetId={editingBudget}
          open={!!editingBudget}
          onOpenChange={(open) => !open && setEditingBudget(null)}
        />
      )}
    </div>
  );
};

export default Budgets;
