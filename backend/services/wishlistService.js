const wishlistRepository = require('../repositories/WishlistRepository');
const Product = require('../models/Product');
const { ApiError } = require('../utils/apiResponse');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await wishlistRepository.findOneWithProducts({ user: userId });
    if (!wishlist) {
      wishlist = await wishlistRepository.create({ user: userId, items: [] });
    }
    return wishlist;
  }

  async addItem(userId, productId) {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');

    let wishlist = await wishlistRepository.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await wishlistRepository.create({ user: userId, items: [] });
    }

    // Add if not exists
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
      await wishlist.save();
    }
    
    // Return populated list
    return await wishlistRepository.findOneWithProducts({ user: userId });
  }

  async removeItem(userId, productId) {
    let wishlist = await wishlistRepository.findOne({ user: userId });
    if (!wishlist) throw new ApiError(404, 'Wishlist not found');

    wishlist.items = wishlist.items.filter(item => item.toString() !== productId);
    await wishlist.save();
    
    return await wishlistRepository.findOneWithProducts({ user: userId });
  }

  async clearWishlist(userId) {
    let wishlist = await wishlistRepository.findOne({ user: userId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }
    return await wishlistRepository.findOneWithProducts({ user: userId });
  }
}

module.exports = new WishlistService();
