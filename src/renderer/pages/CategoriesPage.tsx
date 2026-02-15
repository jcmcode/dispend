import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Plus, Pencil, Trash2, ChevronRight, FolderTree } from 'lucide-react';
import { cn } from '@renderer/lib/utils';
import type { Category, CreateCategoryInput, UpdateCategoryInput, CategoryType } from '@shared/types';

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function buildTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function CategoryItem({
  node,
  depth,
  onEdit,
  onDelete,
}: {
  node: CategoryNode;
  depth: number;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors group',
        )}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-0.5">
            <ChevronRight
              className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-90')}
            />
          </button>
        ) : (
          <span className="w-4.5" />
        )}
        <div
          className="h-3 w-3 rounded-full shrink-0"
          style={{ backgroundColor: node.color || '#6b7280' }}
        />
        <span className="flex-1 text-sm font-medium">{node.name}</span>
        <span className="text-xs text-muted-foreground capitalize">{node.type}</span>
        {!node.isSystem && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(node)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(node)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {expanded &&
        node.children.map((child) => (
          <CategoryItem
            key={child.id}
            node={child}
            depth={depth + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Form
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [parentId, setParentId] = useState<string>('none');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('');

  const loadCategories = useCallback(async () => {
    const data = await window.api.categories.list();
    setCategories(data);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const tree = useMemo(() => {
    const filtered =
      filterType === 'all' ? categories : categories.filter((c) => c.type === filterType);
    return buildTree(filtered);
  }, [categories, filterType]);

  const parentOptions = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  const resetForm = () => {
    setName('');
    setType('expense');
    setParentId('none');
    setColor('#6366f1');
    setIcon('');
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setParentId(cat.parentId || 'none');
    setColor(cat.color || '#6366f1');
    setIcon(cat.icon || '');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editingCategory) {
      const input: UpdateCategoryInput = {
        id: editingCategory.id,
        name: name.trim(),
        color,
        icon: icon.trim() || null,
        parentId: parentId === 'none' ? null : parentId,
      };
      await window.api.categories.update(input);
    } else {
      const input: CreateCategoryInput = {
        name: name.trim(),
        type,
        color,
        icon: icon.trim() || undefined,
        parentId: parentId === 'none' ? undefined : parentId,
      };
      await window.api.categories.create(input);
    }

    setDialogOpen(false);
    resetForm();
    loadCategories();
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    await window.api.categories.delete(deletingCategory.id);
    setDeleteDialogOpen(false);
    setDeletingCategory(null);
    loadCategories();
  };

  return (
    <div>
      <Header title="Categories" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {categories.length} categories
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {tree.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            {tree.map((node) => (
              <CategoryItem
                key={node.id}
                node={node}
                depth={0}
                onEdit={openEditDialog}
                onDelete={(cat) => {
                  setDeletingCategory(cat);
                  setDeleteDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category details.' : 'Create a new category.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category name"
                />
              </div>
              {!editingCategory && (
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as CategoryType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label>Parent Category</Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {parentOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cat-color">Color</Label>
                  <Input
                    id="cat-color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 p-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cat-icon">Icon</Label>
                  <Input
                    id="cat-icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. home"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!name.trim()}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{deletingCategory?.name}&quot;? Transactions using
                this category will become uncategorized. Child categories will become top-level.
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
