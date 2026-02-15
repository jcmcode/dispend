export type CategoryType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  type: CategoryType;
  isSystem: boolean;
  sortOrder: number;
  createdAt: string;
  // Computed
  children?: Category[];
}

export interface CreateCategoryInput {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
  type: CategoryType;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  icon?: string | null;
  color?: string | null;
  parentId?: string | null;
  sortOrder?: number;
}
