export type InsightType = 'anomaly' | 'trend' | 'recurring' | 'suggestion';
export type InsightSeverity = 'info' | 'warning' | 'alert';

export interface Insight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  category?: string;
  amount?: number;
  percentChange?: number;
  actionLabel?: string;
  actionRoute?: string;
  dismissed?: boolean;
}

export interface SpendingAnomaly {
  categoryId: string;
  categoryName: string;
  currentAmount: number;
  averageAmount: number;
  percentAboveAverage: number;
}

export interface SpendingTrend {
  categoryId: string;
  categoryName: string;
  months: { month: string; amount: number }[];
  direction: 'increasing' | 'decreasing' | 'stable';
  averageChange: number;
}

export interface RecurringDetection {
  description: string;
  amount: number;
  frequency: string;
  lastDate: string;
  count: number;
}
