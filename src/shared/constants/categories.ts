export interface DefaultCategory {
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'transfer';
  children?: Omit<DefaultCategory, 'children' | 'type'>[];
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Expense categories
  {
    name: 'Housing',
    icon: 'home',
    color: '#6366f1',
    type: 'expense',
    children: [
      { name: 'Rent/Mortgage', icon: 'building', color: '#818cf8' },
      { name: 'Property Tax', icon: 'landmark', color: '#a5b4fc' },
      { name: 'Home Insurance', icon: 'shield', color: '#c7d2fe' },
      { name: 'Maintenance', icon: 'wrench', color: '#e0e7ff' },
      { name: 'Utilities', icon: 'zap', color: '#ddd6fe' },
    ],
  },
  {
    name: 'Transportation',
    icon: 'car',
    color: '#f59e0b',
    type: 'expense',
    children: [
      { name: 'Gas', icon: 'fuel', color: '#fbbf24' },
      { name: 'Car Insurance', icon: 'shield-check', color: '#fcd34d' },
      { name: 'Car Payment', icon: 'credit-card', color: '#fde68a' },
      { name: 'Parking', icon: 'square-parking', color: '#fef3c7' },
      { name: 'Public Transit', icon: 'train', color: '#fef9c3' },
      { name: 'Ride Share', icon: 'map-pin', color: '#fffbeb' },
    ],
  },
  {
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#ef4444',
    type: 'expense',
    children: [
      { name: 'Groceries', icon: 'shopping-cart', color: '#f87171' },
      { name: 'Restaurants', icon: 'utensils-crossed', color: '#fca5a5' },
      { name: 'Coffee Shops', icon: 'coffee', color: '#fecaca' },
      { name: 'Fast Food', icon: 'sandwich', color: '#fee2e2' },
      { name: 'Alcohol & Bars', icon: 'wine', color: '#fef2f2' },
    ],
  },
  {
    name: 'Shopping',
    icon: 'shopping-bag',
    color: '#ec4899',
    type: 'expense',
    children: [
      { name: 'Clothing', icon: 'shirt', color: '#f472b6' },
      { name: 'Electronics', icon: 'smartphone', color: '#f9a8d4' },
      { name: 'Home Goods', icon: 'sofa', color: '#fbcfe8' },
      { name: 'Personal Care', icon: 'sparkles', color: '#fce7f3' },
    ],
  },
  {
    name: 'Entertainment',
    icon: 'gamepad-2',
    color: '#8b5cf6',
    type: 'expense',
    children: [
      { name: 'Streaming Services', icon: 'tv', color: '#a78bfa' },
      { name: 'Movies & Events', icon: 'ticket', color: '#c4b5fd' },
      { name: 'Games', icon: 'gamepad', color: '#ddd6fe' },
      { name: 'Hobbies', icon: 'palette', color: '#ede9fe' },
    ],
  },
  {
    name: 'Health & Fitness',
    icon: 'heart-pulse',
    color: '#10b981',
    type: 'expense',
    children: [
      { name: 'Gym', icon: 'dumbbell', color: '#34d399' },
      { name: 'Medical', icon: 'stethoscope', color: '#6ee7b7' },
      { name: 'Dental', icon: 'smile', color: '#a7f3d0' },
      { name: 'Pharmacy', icon: 'pill', color: '#d1fae5' },
      { name: 'Health Insurance', icon: 'shield-plus', color: '#ecfdf5' },
    ],
  },
  {
    name: 'Education',
    icon: 'graduation-cap',
    color: '#0ea5e9',
    type: 'expense',
    children: [
      { name: 'Tuition', icon: 'school', color: '#38bdf8' },
      { name: 'Books & Supplies', icon: 'book-open', color: '#7dd3fc' },
      { name: 'Courses', icon: 'monitor-play', color: '#bae6fd' },
    ],
  },
  {
    name: 'Bills & Subscriptions',
    icon: 'receipt',
    color: '#f97316',
    type: 'expense',
    children: [
      { name: 'Phone', icon: 'phone', color: '#fb923c' },
      { name: 'Internet', icon: 'wifi', color: '#fdba74' },
      { name: 'Software', icon: 'app-window', color: '#fed7aa' },
      { name: 'Insurance', icon: 'shield', color: '#ffedd5' },
    ],
  },
  {
    name: 'Travel',
    icon: 'plane',
    color: '#14b8a6',
    type: 'expense',
    children: [
      { name: 'Flights', icon: 'plane-takeoff', color: '#2dd4bf' },
      { name: 'Hotels', icon: 'bed', color: '#5eead4' },
      { name: 'Vacation Activities', icon: 'camera', color: '#99f6e4' },
    ],
  },
  {
    name: 'Personal',
    icon: 'user',
    color: '#64748b',
    type: 'expense',
    children: [
      { name: 'Gifts', icon: 'gift', color: '#94a3b8' },
      { name: 'Donations', icon: 'heart-handshake', color: '#cbd5e1' },
      { name: 'Pet Care', icon: 'paw-print', color: '#e2e8f0' },
      { name: 'Childcare', icon: 'baby', color: '#f1f5f9' },
    ],
  },
  {
    name: 'Fees & Charges',
    icon: 'alert-circle',
    color: '#dc2626',
    type: 'expense',
    children: [
      { name: 'Bank Fees', icon: 'landmark', color: '#ef4444' },
      { name: 'Interest Charges', icon: 'percent', color: '#f87171' },
      { name: 'Late Fees', icon: 'clock', color: '#fca5a5' },
    ],
  },
  {
    name: 'Taxes',
    icon: 'file-text',
    color: '#78716c',
    type: 'expense',
    children: [
      { name: 'Income Tax', icon: 'calculator', color: '#a8a29e' },
      { name: 'Sales Tax', icon: 'receipt', color: '#d6d3d1' },
    ],
  },

  // Income categories
  {
    name: 'Salary',
    icon: 'briefcase',
    color: '#22c55e',
    type: 'income',
    children: [
      { name: 'Regular Pay', icon: 'banknote', color: '#4ade80' },
      { name: 'Bonus', icon: 'trophy', color: '#86efac' },
      { name: 'Overtime', icon: 'clock', color: '#bbf7d0' },
    ],
  },
  {
    name: 'Freelance',
    icon: 'laptop',
    color: '#06b6d4',
    type: 'income',
  },
  {
    name: 'Investment Income',
    icon: 'trending-up',
    color: '#8b5cf6',
    type: 'income',
    children: [
      { name: 'Dividends', icon: 'coins', color: '#a78bfa' },
      { name: 'Capital Gains', icon: 'arrow-up-right', color: '#c4b5fd' },
      { name: 'Interest', icon: 'percent', color: '#ddd6fe' },
    ],
  },
  {
    name: 'Other Income',
    icon: 'plus-circle',
    color: '#84cc16',
    type: 'income',
    children: [
      { name: 'Refunds', icon: 'rotate-ccw', color: '#a3e635' },
      { name: 'Gifts Received', icon: 'gift', color: '#bef264' },
      { name: 'Side Income', icon: 'coins', color: '#d9f99d' },
    ],
  },

  // Transfer
  {
    name: 'Transfer',
    icon: 'arrow-left-right',
    color: '#6b7280',
    type: 'transfer',
    children: [
      { name: 'Account Transfer', icon: 'repeat', color: '#9ca3af' },
      { name: 'Credit Card Payment', icon: 'credit-card', color: '#d1d5db' },
      { name: 'Loan Payment', icon: 'landmark', color: '#e5e7eb' },
    ],
  },
];
