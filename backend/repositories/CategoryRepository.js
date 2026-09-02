const BaseRepository = require('./BaseRepository');
const Category = require('../models/Category');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findBySlug(slug) {
    return await this.model.findOne({ slug, isActive: true });
  }

  async findAllActive() {
    return await this.model.find({ isActive: true }).sort('sortOrder');
  }
}

module.exports = new CategoryRepository();
