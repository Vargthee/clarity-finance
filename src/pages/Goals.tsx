import { useState } from "react";
import { useTransactions } from "@/contexts/TransactionsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Target } from "lucide-react";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import { EditGoalDialog } from "@/components/goals/EditGoalDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

const Goals = () => {
  const { goals, deleteGoal } = useTransactions();
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return "bg-income";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-primary";
  };

  const handleDelete = () => {
    if (deletingGoal) {
      deleteGoal(deletingGoal);
      setDeletingGoal(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-muted-foreground mt-1">
            Track your financial goals and savings progress
          </p>
        </div>
        <AddGoalDialog
          trigger={
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="mr-2 h-5 w-5" />
              Add Goal
            </Button>
          }
        />
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking your financial goals and watch your progress grow
            </p>
            <AddGoalDialog
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Goal
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const percentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const isComplete = goal.currentAmount >= goal.targetAmount;
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <Card
                key={goal.id}
                className={`shadow-card hover:shadow-lg transition-all ${
                  isComplete ? "border-income/50 bg-income/5" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <CardTitle className="text-xl">{goal.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingGoal(goal.id)}
                        className="hover:bg-accent h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingGoal(goal.id)}
                        className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-3 ${getProgressColor(goal.currentAmount, goal.targetAmount)}`}
                    />
                    <div className="text-sm text-muted-foreground text-right">
                      {percentage.toFixed(0)}% complete
                    </div>
                  </div>

                  {goal.deadline && (
                    <div className="pt-2 border-t text-sm">
                      <span className="text-muted-foreground">Target date: </span>
                      <span className="font-medium">
                        {format(new Date(goal.deadline), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    {isComplete ? (
                      <div className="text-sm font-medium text-income flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Goal achieved! 🎉
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-foreground">
                        ₦{remaining.toLocaleString()} remaining
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Goal Dialog */}
      {editingGoal && (
        <EditGoalDialog
          goalId={editingGoal}
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingGoal} onOpenChange={(open) => !open && setDeletingGoal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Goals;
