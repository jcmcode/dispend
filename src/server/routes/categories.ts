import { Router } from 'express';
import * as categoryService from '../../main/services/category.service';

const router = Router();

router.get('/', (_req, res) => {
  const categories = categoryService.listCategories();
  res.json(categories);
});

router.get('/:id', (req, res) => {
  const category = categoryService.getCategory(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

router.post('/', (req, res) => {
  const category = categoryService.createCategory(req.body);
  res.status(201).json(category);
});

router.put('/:id', (req, res) => {
  const category = categoryService.updateCategory({ ...req.body, id: req.params.id });
  res.json(category);
});

router.delete('/:id', (req, res) => {
  categoryService.deleteCategory(req.params.id);
  res.status(204).end();
});

export default router;
