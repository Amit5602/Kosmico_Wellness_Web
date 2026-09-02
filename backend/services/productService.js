const productRepository = require('../repositories/ProductRepository');
const cacheService = require('./cacheService');

class ProductService {
  async getAllProducts(filters = {}) {
    // Generate deterministic cache key based on filters
    const cacheKey = `product:list:${JSON.stringify(filters || {})}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const data = await productRepository.searchAndFilter(filters);
    await cacheService.set(cacheKey, data, 300); // 5 min TTL
    return data;
  }

  async getProductBySlug(slug) {
    const cacheKey = `product:slug:${slug}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const data = await productRepository.findBySlug(slug);
    if (data) {
      await cacheService.set(cacheKey, data, 900); // 15 min TTL
    }
    return data;
  }

  async createProduct(data) {
    const product = await productRepository.create(data);
    await cacheService.deleteByPattern('product:list:*');
    return product;
  }

  async updateProduct(id, data) {
    const product = await productRepository.update(id, data);
    if (product) {
      await cacheService.deleteByPattern('product:list:*');
      await cacheService.delete(`product:slug:${product.slug}`);
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await productRepository.delete(id);
    if (product) {
      await cacheService.deleteByPattern('product:list:*');
      await cacheService.delete(`product:slug:${product.slug}`);
    }
    return product;
  }
}

module.exports = new ProductService();
