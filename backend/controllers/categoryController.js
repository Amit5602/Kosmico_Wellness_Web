const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const categoryService = require('../services/categoryService');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched successfully'));
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, { category }, 'Category fetched successfully'));
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(new ApiResponse(201, { category }, 'Category created'));
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, { category }, 'Category updated'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, null, 'Category deleted'));
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
