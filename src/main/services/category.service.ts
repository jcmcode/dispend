import { eq, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '../db/connection';
import { categories } from '../db/schema';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@shared/types';

/**
 * Returns all categories as a flat array sorted by sortOrder then name.
 * The renderer is responsible for assembling the parent/child hierarchy.
 */
export function listCategories(): Category[] {
  const db = getDb();

  const rows = db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();

  return rows as Category[];
}

/**
 * Retrieves a single category by its ID, or null if not found.
 */
export function getCategory(id: string): Category | null {
  const db = getDb();

  const row = db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .get();

  return (row as Category) ?? null;
}

/**
 * Creates a new category and returns the full row.
 */
export function createCategory(input: CreateCategoryInput): Category {
  const db = getDb();
  const now = new Date().toISOString();
  const id = nanoid();

  const newCategory = {
    id,
    name: input.name,
    icon: input.icon ?? null,
    color: input.color ?? null,
    parentId: input.parentId ?? null,
    type: input.type,
    isSystem: false,
    sortOrder: 0,
    createdAt: now,
  };

  db.insert(categories).values(newCategory).run();

  const created = getCategory(id);
  if (!created) {
    throw new Error('Failed to create category: could not retrieve inserted row.');
  }

  return created;
}

/**
 * Updates an existing category and returns the full updated row.
 * Only the fields present on the input object are modified.
 *
 * System categories (isSystem = true) cannot have their name or type changed.
 */
export function updateCategory(input: UpdateCategoryInput): Category {
  const db = getDb();

  const existing = getCategory(input.id);
  if (!existing) {
    throw new Error(`Category not found: ${input.id}`);
  }

  if (existing.isSystem && input.name !== undefined) {
    throw new Error('Cannot rename a system category.');
  }

  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.icon !== undefined) updates.icon = input.icon;
  if (input.color !== undefined) updates.color = input.color;
  if (input.parentId !== undefined) updates.parentId = input.parentId;
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;

  // Only apply if there is something to update
  if (Object.keys(updates).length === 0) {
    return existing;
  }

  db.update(categories).set(updates).where(eq(categories.id, input.id)).run();

  const updated = getCategory(input.id);
  if (!updated) {
    throw new Error(`Failed to retrieve category after update: ${input.id}`);
  }

  return updated;
}

/**
 * Deletes a category by ID.
 *
 * System categories cannot be deleted.
 * Child categories will have their parentId set to NULL via ON DELETE SET NULL.
 * Transactions referencing this category will have categoryId set to NULL via ON DELETE SET NULL.
 */
export function deleteCategory(id: string): void {
  const db = getDb();

  const existing = getCategory(id);
  if (!existing) {
    throw new Error(`Category not found: ${id}`);
  }

  if (existing.isSystem) {
    throw new Error('Cannot delete a system category.');
  }

  db.delete(categories).where(eq(categories.id, id)).run();
}
