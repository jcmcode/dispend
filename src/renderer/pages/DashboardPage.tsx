import { Header } from '@renderer/components/layout/Header';

export function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Monthly Spending</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Active Budgets</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          Welcome to Dispend. Add accounts and transactions to get started.
        </div>
      </div>
    </div>
  );
}
