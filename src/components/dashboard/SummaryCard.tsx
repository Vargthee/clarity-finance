import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  variant?: "default" | "income" | "expense";
}

export function SummaryCard({ title, amount, icon: Icon, variant = "default" }: SummaryCardProps) {
  const iconColorClass = 
    variant === "income" ? "text-income" : 
    variant === "expense" ? "text-expense" : 
    "text-primary";

  const bgColorClass = 
    variant === "income" ? "bg-income/10" : 
    variant === "expense" ? "bg-expense/10" : 
    "bg-primary/10";

  return (
    <Card className="shadow-card hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{amount}</p>
          </div>
          <div className={`p-4 rounded-full ${bgColorClass}`}>
            <Icon className={`h-8 w-8 ${iconColorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
