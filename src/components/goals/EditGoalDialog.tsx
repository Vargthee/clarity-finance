import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTransactions } from "@/contexts/TransactionsContext";

const goalIcons = ["🎯", "🏠", "🚗", "✈️", "🎓", "💍", "🏖️", "📱"];

interface EditGoalDialogProps {
  goalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGoalDialog({ goalId, open, onOpenChange }: EditGoalDialogProps) {
  const { goals, updateGoal } = useTransactions();
  const goal = goals.find((g) => g.id === goalId);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [selectedIcon, setSelectedIcon] = useState("🎯");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDeadline(goal.deadline ? new Date(goal.deadline) : undefined);
      setSelectedIcon(goal.icon || "🎯");
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !targetAmount) {
      return;
    }

    updateGoal(goalId, {
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: deadline ? format(deadline, "yyyy-MM-dd") : undefined,
      icon: selectedIcon,
    });

    onOpenChange(false);
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update your goal details and track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Name</Label>
            <Input
              id="title"
              placeholder="e.g., Vacation Fund, Emergency Savings"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {goalIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    "text-2xl p-2 rounded-lg border-2 hover:bg-accent transition-colors",
                    selectedIcon === icon
                      ? "border-primary bg-primary/10"
                      : "border-transparent"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Amount (₦)</Label>
            <Input
              id="target"
              type="number"
              step="1"
              placeholder="0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current">Current Amount (₦)</Label>
            <Input
              id="current"
              type="number"
              step="1"
              placeholder="0"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Target Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            Update Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
