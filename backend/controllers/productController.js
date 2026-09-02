const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const productService = require('../services/productService');

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  
  res.status(200).json(
    new ApiResponse(200, result.data, 'Products fetched successfully') // We can attach meta to ApiResponse if we want, but for now we'll just extend it
  );
});

// Since ApiResponse takes data, let's just assign meta to the response object explicitly for pagination.
const getProductsPaginated = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  const response = new ApiResponse(200, result.data, 'Products fetched successfully');
  response.meta = result.meta;
  res.status(200).json(response);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  
  res.status(200).json(
    new ApiResponse(200, { product }, 'Product fetched successfully')
  );
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(new ApiResponse(201, { product }, 'Product created'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) throw new ApiError(404, 'Product not found');
  res.status(200).json(new ApiResponse(200, { product }, 'Product updated'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.status(200).json(new ApiResponse(200, null, 'Product deleted'));
});

module.exports = {
  getProducts: getProductsPaginated,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
