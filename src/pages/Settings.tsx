import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage your preferences and application settings
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-4 sm:gap-6 max-w-3xl">
        {/* Appearance */}
        <Card className="shadow-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="theme" className="text-sm">Theme</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select your preferred theme
                </p>
              </div>
              <Select defaultValue="system">
                <SelectTrigger className="w-full sm:w-32" id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card className="shadow-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Currency</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Set your preferred currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="currency" className="text-sm">Default Currency</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All amounts will be displayed in this currency
                </p>
              </div>
              <Select defaultValue="ngn">
                <SelectTrigger className="w-full sm:w-32" id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngn">NGN (₦)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="budget-alerts" className="text-sm">Budget Alerts</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get notified when approaching budget limits
                </p>
              </div>
              <Switch id="budget-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="transaction-updates" className="text-sm">Transaction Updates</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receive notifications for new transactions
                </p>
              </div>
              <Switch id="transaction-updates" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="shadow-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Data Management</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage your financial data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm">Export Data</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Download your transactions as CSV
                </p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic">
                Coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
