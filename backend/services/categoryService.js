const categoryRepository = require('../repositories/CategoryRepository');

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.findAllActive();
  }

  async getCategoryBySlug(slug) {
    return await categoryRepository.findBySlug(slug);
  }

  async createCategory(data) {
    return await categoryRepository.create(data);
  }

  async updateCategory(id, data) {
    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    return await categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
