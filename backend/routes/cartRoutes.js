const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { z } = require('zod');

const addToCartSchema = {
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive().default(1),
    variant: z.string().optional(),
  })
};

const updateCartSchema = {
  body: z.object({
    quantity: z.number().int().positive(),
    variant: z.string().optional(),
  })
};

router.use(protect); // All cart routes require authentication

router.route('/')
  .get(cartController.getCart)
  .delete(cartController.clearCart);

router.route('/items')
  .post(validate(addToCartSchema), cartController.addToCart);

router.route('/items/:productId')
  .patch(validate(updateCartSchema), cartController.updateCartItem)
  .delete(cartController.removeCartItem);

module.exports = router;
