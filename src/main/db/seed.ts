import { nanoid } from 'nanoid';
import { getRawDb } from './connection';
import { DEFAULT_CATEGORIES } from '../../shared/constants/categories';

export function seedCategories(): void {
  const sqlite = getRawDb();
  const count = sqlite.prepare('SELECT COUNT(*) as count FROM categories').get() as {
    count: number;
  };

  if (count.count > 0) return;

  const now = new Date().toISOString();
  const insert = sqlite.prepare(
    'INSERT INTO categories (id, name, icon, color, parent_id, type, is_system, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const insertAll = sqlite.transaction(() => {
    let sortOrder = 0;
    for (const cat of DEFAULT_CATEGORIES) {
      const parentId = nanoid();
      insert.run(parentId, cat.name, cat.icon, cat.color, null, cat.type, 1, sortOrder++, now);

      if (cat.children) {
        let childSort = 0;
        for (const child of cat.children) {
          insert.run(
            nanoid(),
            child.name,
            child.icon,
            child.color,
            parentId,
            cat.type,
            1,
            childSort++,
            now
          );
        }
      }
    }
  });

  insertAll();
  console.log('Seeded default categories');
}
