const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require auth

router.route('/')
  .post(orderController.createOrder)
  .get(orderController.getUserOrders);

router.route('/:orderNumber')
  .get(orderController.getOrder);

router.route('/:orderNumber/cancel')
  .patch(orderController.cancelOrder);

// Only admins can update order statuses
router.route('/:id/status')
  .patch(authorizeRoles('admin'), orderController.updateOrderStatus);

module.exports = router;
