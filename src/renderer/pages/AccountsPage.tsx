import { useState, useEffect, useCallback } from 'react';
import { Header } from '@renderer/components/layout/Header';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@renderer/components/ui/dialog';
import { Plus, Pencil, Trash2, Landmark, CreditCard, PiggyBank, TrendingUp, Banknote, HandCoins, Wallet } from 'lucide-react';
import { formatCurrency } from '@renderer/lib/formatters';
import { ACCOUNT_TYPES, CURRENCIES } from '@renderer/lib/constants';
import type { Account, CreateAccountInput, UpdateAccountInput, AccountType, Currency } from '@shared/types';

const ACCOUNT_ICONS: Record<AccountType, React.ComponentType<{ className?: string }>> = {
  checking: Landmark,
  savings: PiggyBank,
  credit_card: CreditCard,
  investment: TrendingUp,
  cash: Banknote,
  loan: HandCoins,
  other: Wallet,
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [institution, setInstitution] = useState('');
  const [currency, setCurrency] = useState<Currency>('CAD');
  const [balance, setBalance] = useState('0');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#6366f1');

  const loadAccounts = useCallback(async () => {
    const data = await window.api.accounts.list();
    setAccounts(data);
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const resetForm = () => {
    setName('');
    setType('checking');
    setInstitution('');
    setCurrency('CAD');
    setBalance('0');
    setNotes('');
    setColor('#6366f1');
    setEditingAccount(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setName(account.name);
    setType(account.type);
    setInstitution(account.institution || '');
    setCurrency(account.currency);
    setBalance(String(account.currentBalance));
    setNotes(account.notes || '');
    setColor(account.color || '#6366f1');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editingAccount) {
      const input: UpdateAccountInput = {
        id: editingAccount.id,
        name: name.trim(),
        type,
        institution: institution.trim() || null,
        currency,
        currentBalance: parseFloat(balance) || 0,
        notes: notes.trim() || null,
        color,
      };
      await window.api.accounts.update(input);
    } else {
      const input: CreateAccountInput = {
        name: name.trim(),
        type,
        institution: institution.trim() || undefined,
        currency,
        currentBalance: parseFloat(balance) || 0,
        notes: notes.trim() || undefined,
        color,
      };
      await window.api.accounts.create(input);
    }

    setDialogOpen(false);
    resetForm();
    loadAccounts();
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;
    await window.api.accounts.delete(deletingAccount.id);
    setDeleteDialogOpen(false);
    setDeletingAccount(null);
    loadAccounts();
  };

  const totalBalance = accounts
    .filter((a) => a.isActive)
    .reduce((sum, a) => sum + a.currentBalance, 0);

  return (
    <div>
      <Header title="Accounts" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} &middot; Total: {formatCurrency(totalBalance)}
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Landmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No accounts yet. Add your first account to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => {
              const Icon = ACCOUNT_ICONS[account.type] || Wallet;
              return (
                <div
                  key={account.id}
                  className="rounded-lg border bg-card p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: account.color || '#6366f1' }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ACCOUNT_TYPES.find((t) => t.value === account.type)?.label}
                          {account.institution && ` · ${account.institution}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(account)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingAccount(account);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold">
                      {formatCurrency(account.currentBalance, account.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">{account.currency}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit Account' : 'New Account'}</DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Update account details.' : 'Add a new financial account.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Checking"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. TD Bank"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 p-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!name.trim()}>
                {editingAccount ? 'Save Changes' : 'Create Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{deletingAccount?.name}&quot;? This will also delete all
                transactions associated with this account. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
