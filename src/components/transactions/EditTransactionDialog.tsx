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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTransactions } from "@/contexts/TransactionsContext";

const categories = ["Food", "Rent", "Salary", "Transport", "Entertainment", "Shopping"];

interface EditTransactionDialogProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
  transactionId,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const { transactions, updateTransaction } = useTransactions();
  const transaction = transactions.find((t) => t.id === transactionId);

  const [date, setDate] = useState<Date>();
  const [isIncome, setIsIncome] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (transaction) {
      setDate(new Date(transaction.date));
      setIsIncome(transaction.type === "income");
      setAmount(Math.abs(transaction.amount).toString());
      setDescription(transaction.description);
      setCategory(transaction.category);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date || !description || !category) {
      return;
    }

    const numAmount = parseFloat(amount);
    updateTransaction(transactionId, {
      date: format(date, "yyyy-MM-dd"),
      description,
      category,
      amount: isIncome ? numAmount : -numAmount,
      type: isIncome ? "income" : "expense",
    });

    onOpenChange(false);
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the transaction details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Transaction Type
            </Label>
            <div className="flex items-center space-x-2">
              <span className={cn("text-sm font-medium", !isIncome && "text-muted-foreground")}>
                Expense
              </span>
              <Switch
                id="type"
                checked={isIncome}
                onCheckedChange={setIsIncome}
              />
              <span className={cn("text-sm font-medium", isIncome && "text-muted-foreground")}>
                Income
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Update Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
