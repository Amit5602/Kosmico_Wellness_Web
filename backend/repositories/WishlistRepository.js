const BaseRepository = require('./BaseRepository');
const Wishlist = require('../models/Wishlist');

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist);
  }

  async findOneWithProducts(query) {
    return this.model.findOne(query).populate('items');
  }
}

module.exports = new WishlistRepository();
