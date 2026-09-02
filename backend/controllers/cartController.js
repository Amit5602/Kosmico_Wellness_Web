const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const cartService = require('../services/cartService');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json(new ApiResponse(200, { cart }, 'Cart retrieved'));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, variant } = req.body;
  if (!productId || quantity == null) {
    throw new ApiError(400, 'Product ID and quantity are required');
  }
  const cart = await cartService.addToCart(req.user._id, productId, quantity, variant);
  res.status(200).json(new ApiResponse(200, { cart }, 'Item added to cart'));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, variant } = req.body;
  if (quantity == null) {
    throw new ApiError(400, 'Quantity is required');
  }
  const cart = await cartService.updateItemQuantity(req.user._id, req.params.productId, quantity, variant);
  res.status(200).json(new ApiResponse(200, { cart }, 'Cart item updated'));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const variantSize = req.body.variant || req.query.variant;
  const cart = await cartService.removeCartItem(req.user._id, req.params.productId, variantSize);
  res.status(200).json(new ApiResponse(200, { cart }, 'Item removed from cart'));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.status(200).json(new ApiResponse(200, { cart }, 'Cart cleared'));
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
