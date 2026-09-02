const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router.route('/:slug')
  .get(productController.getProductBySlug);

router.route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
