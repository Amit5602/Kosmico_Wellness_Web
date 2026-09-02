const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.route('/')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router.route('/:slug')
  .get(categoryController.getCategoryBySlug);

router.route('/:id')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
