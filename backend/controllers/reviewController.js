const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const reviewService = require('../services/reviewService');

const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, content } = req.body;

  if (!rating || !title || !content) {
    throw new ApiError(400, 'Rating, title, and content are required');
  }

  const review = await reviewService.createReview(productId, req.user._id, rating, title, content);
  res.status(201).json(new ApiResponse(201, { review }, 'Review created successfully'));
});

const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const result = await reviewService.getProductReviews(productId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched successfully'));
});

const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await reviewService.updateReview(id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { review }, 'Review updated successfully'));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await reviewService.deleteReview(id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
});

const toggleHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await reviewService.toggleHelpful(id, req.user._id);
  res.status(200).json(new ApiResponse(200, { review }, 'Helpful status toggled'));
});

const getRatingStats = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const stats = await reviewService.getProductRatingStats(productId);
  res.status(200).json(new ApiResponse(200, { stats }, 'Stats fetched successfully'));
});

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  toggleHelpful,
  getRatingStats,
};
