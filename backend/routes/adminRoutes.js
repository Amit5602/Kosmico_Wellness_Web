const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Secure all admin routes
router.use(protect, authorizeRoles('admin'));

// Analytics
router.get('/analytics/overview', adminController.getAnalytics);

// Users
router.route('/users')
  .get(adminController.getUsers);
router.route('/users/:id/role')
  .patch(adminController.updateUserRole);

// Orders
router.route('/orders')
  .get(adminController.getOrders);
router.route('/orders/:id/status')
  .patch(adminController.updateOrderStatus);

const { upload } = require('../utils/cloudinary');

// Products
router.route('/products')
  .get(adminController.getProducts)
  .post(upload.array('images', 5), adminController.createProduct);
router.route('/products/:id')
  .patch(upload.array('images', 5), adminController.updateProduct)
  .delete(adminController.deleteProduct);

// Reviews
router.route('/reviews')
  .get(adminController.getReviews);
router.route('/reviews/:id/status')
  .patch(adminController.updateReviewStatus);

module.exports = router;
