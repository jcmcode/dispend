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
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@renderer/lib/formatters';
import { TRANSACTION_TYPES, TRANSACTION_STATUSES } from '@renderer/lib/constants';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionType,
  TransactionStatus,
  TransactionFilters,
  Account,
  Category,
  Currency,
} from '@shared/types';

const PAGE_SIZE = 50;

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  // Form state
  const [formAccountId, setFormAccountId] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formAmount, setFormAmount] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formStatus, setFormStatus] = useState<TransactionStatus>('cleared');
  const [formNotes, setFormNotes] = useState('');

  const loadTransactions = useCallback(async () => {
    const filters: TransactionFilters = {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    };
    if (search) filters.search = search;
    if (filterAccount !== 'all') filters.accountId = filterAccount;
    if (filterCategory !== 'all') filters.categoryId = filterCategory;
    if (filterType !== 'all') filters.type = filterType as TransactionType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const result = await window.api.transactions.list(filters);
    setTransactions(result.data);
    setTotal(result.total);
  }, [search, filterAccount, filterCategory, filterType, startDate, endDate, page]);

  const loadRefData = useCallback(async () => {
    const [accts, cats] = await Promise.all([
      window.api.accounts.list(),
      window.api.categories.list(),
    ]);
    setAccounts(accts);
    setCategories(cats);
  }, []);

  useEffect(() => {
    loadRefData();
  }, [loadRefData]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const resetForm = () => {
    setFormAccountId(accounts[0]?.id || '');
    setFormCategoryId('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormAmount('');
    setFormDescription('');
    setFormType('expense');
    setFormStatus('cleared');
    setFormNotes('');
    setEditingTransaction(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (txn: Transaction) => {
    setEditingTransaction(txn);
    setFormAccountId(txn.accountId);
    setFormCategoryId(txn.categoryId || '');
    setFormDate(txn.date);
    setFormAmount(String(Math.abs(txn.amount)));
    setFormDescription(txn.description);
    setFormType(txn.type);
    setFormStatus(txn.status);
    setFormNotes(txn.notes || '');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formDescription.trim() || !formAccountId || !formAmount) return;

    const amount = parseFloat(formAmount);
    const signedAmount = formType === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    const account = accounts.find((a) => a.id === formAccountId);

    if (editingTransaction) {
      const input: UpdateTransactionInput = {
        id: editingTransaction.id,
        accountId: formAccountId,
        categoryId: formCategoryId || null,
        date: formDate,
        amount: signedAmount,
        description: formDescription.trim(),
        type: formType,
        status: formStatus,
        notes: formNotes.trim() || null,
      };
      await window.api.transactions.update(input);
    } else {
      const input: CreateTransactionInput = {
        accountId: formAccountId,
        categoryId: formCategoryId || undefined,
        date: formDate,
        amount: signedAmount,
        description: formDescription.trim(),
        type: formType,
        status: formStatus,
        currency: (account?.currency || 'CAD') as Currency,
        notes: formNotes.trim() || undefined,
      };
      await window.api.transactions.create(input);
    }

    setDialogOpen(false);
    resetForm();
    loadTransactions();
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    await window.api.transactions.delete(deletingTransaction.id);
    setDeleteDialogOpen(false);
    setDeletingTransaction(null);
    loadTransactions();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'income');

  return (
    <div>
      <Header title="Transactions" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {total} transaction{total !== 1 ? 's' : ''}
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9"
            />
          </div>
          <Select value={filterAccount} onValueChange={(v) => { setFilterAccount(v); setPage(0); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(0); }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TRANSACTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
            className="w-[150px]"
            placeholder="Start date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
            className="w-[150px]"
            placeholder="End date"
          />
        </div>

        {/* Transaction Table */}
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Account</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-right p-3 font-medium w-[80px]"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-muted-foreground">{formatDate(txn.date)}</td>
                    <td className="p-3">
                      <span className="font-medium">{txn.description}</span>
                      {txn.notes && (
                        <span className="block text-xs text-muted-foreground">{txn.notes}</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{txn.accountName || '—'}</td>
                    <td className="p-3 text-muted-foreground">{txn.categoryName || '—'}</td>
                    <td className={`p-3 text-right font-medium ${txn.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(txn.amount, txn.currency)}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(txn)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setDeletingTransaction(txn);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
              <DialogDescription>
                {editingTransaction ? 'Update transaction details.' : 'Record a new transaction.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={formType} onValueChange={(v) => setFormType(v as TransactionType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={formStatus} onValueChange={(v) => setFormStatus(v as TransactionStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Account</Label>
                <Select value={formAccountId} onValueChange={setFormAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="txn-date">Date</Label>
                  <Input
                    id="txn-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="txn-amount">Amount</Label>
                  <Input
                    id="txn-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="txn-desc">Description</Label>
                <Input
                  id="txn-desc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Grocery store"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.parentId ? '  ' : ''}{c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="txn-notes">Notes</Label>
                <Input
                  id="txn-notes"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formDescription.trim() || !formAccountId || !formAmount}>
                {editingTransaction ? 'Save Changes' : 'Add Transaction'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
