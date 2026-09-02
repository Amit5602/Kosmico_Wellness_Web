const BaseRepository = require('./BaseRepository');
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async searchAndFilter(query) {
    const { search, category, minPrice, maxPrice, sort, page, limit } = query;
    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      if (mongoose.isValidObjectId(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        } else {
          filter.category = new mongoose.Types.ObjectId(); // No products should match an invalid slug
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (search) {
      sortOption = { score: { $meta: 'textScore' } }; // Sort by relevance if searching
    } else {
      sortOption = { createdAt: -1 };
    }

    return await this.paginate(filter, { page, limit, sort: sortOption, populate: 'category' });
  }

  async findBySlug(slug) {
    return await this.model.findOne({ slug, isActive: true }).populate('category');
  }
}

module.exports = new ProductRepository();
