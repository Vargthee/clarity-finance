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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">{amount}</p>
          </div>
          <div className={`p-3 sm:p-4 rounded-full ${bgColorClass} flex-shrink-0`}>
            <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
