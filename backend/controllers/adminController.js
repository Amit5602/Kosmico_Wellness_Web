const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const adminService = require('../services/adminService');

const getAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getAnalyticsOverview();
  res.status(200).json(new ApiResponse(200, data, 'Analytics fetched'));
});

// Users
const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) throw new ApiError(400, 'Role is required');
  const user = await adminService.updateUserRole(req.user._id, id, role);
  res.status(200).json(new ApiResponse(200, { user }, 'User role updated'));
});

// Orders
const getOrders = asyncHandler(async (req, res) => {
  const result = await adminService.getOrders(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Orders fetched'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) throw new ApiError(400, 'Status is required');
  const order = await adminService.updateOrderStatus(req.user._id, id, status);
  res.status(200).json(new ApiResponse(200, { order }, 'Order status updated'));
});

// Products
const getProducts = asyncHandler(async (req, res) => {
  const result = await adminService.getProducts(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Products fetched'));
});

const createProduct = asyncHandler(async (req, res) => {
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => file.path);
  }
  const product = await adminService.createProduct(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, { product }, 'Product created'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => file.path);
    // Let's assume if there are new images, we replace or append? We'll just replace or pass them.
    req.body.images = newImages; 
  }
  const product = await adminService.updateProduct(req.user._id, id, req.body);
  res.status(200).json(new ApiResponse(200, { product }, 'Product updated'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await adminService.deleteProduct(req.user._id, id);
  res.status(200).json(new ApiResponse(200, { product }, 'Product soft-deleted'));
});

// Reviews
const getReviews = asyncHandler(async (req, res) => {
  const result = await adminService.getReviews(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched'));
});

const updateReviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;
  if (isApproved === undefined) throw new ApiError(400, 'isApproved is required');
  const review = await adminService.updateReviewStatus(req.user._id, id, isApproved);
  res.status(200).json(new ApiResponse(200, { review }, 'Review status updated'));
});

module.exports = {
  getAnalytics,
  getUsers,
  updateUserRole,
  getOrders,
  updateOrderStatus,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getReviews,
  updateReviewStatus
};
