const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const AuditLog = require('../models/AuditLog');
const { ApiError } = require('../utils/apiResponse');
const notificationService = require('./notificationService');

class AdminService {
  async logAction(adminId, action, entityType, entityId, metadata = {}) {
    try {
      await AuditLog.create({ admin: adminId, action, entityType, entityId, metadata });
    } catch (err) {
      console.error('AuditLog failure', err);
    }
  }

  async getAnalyticsOverview() {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();

    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    const paymentStatusDistribution = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'PAID', orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalReviews,
      totalRevenue,
      orderStatusDistribution: orderStatusDistribution.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {}),
      paymentStatusDistribution: paymentStatusDistribution.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {}),
    };
  }

  // --- USERS ---
  async getUsers(query) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    let match = {};
    if (search) {
      match = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(match).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(match);

    return {
      users,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
  }

  async updateUserRole(adminId, targetUserId, role) {
    const user = await User.findById(targetUserId);
    if (!user) throw new ApiError(404, 'User not found');
    
    // Safety check: Prevent admin from demoting themselves
    if (adminId.toString() === targetUserId.toString() && role !== 'admin') {
      throw new ApiError(403, 'Cannot demote yourself');
    }

    user.role = role;
    await user.save();
    
    await this.logAction(adminId, 'UPDATE_ROLE', 'User', user._id, { role });
    return user;
  }

  // --- ORDERS ---
  async getOrders(query) {
    const { page = 1, limit = 20, status, search } = query;
    const skip = (page - 1) * limit;

    let match = {};
    if (status) match.orderStatus = status;
    if (search) {
      match.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(match)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Order.countDocuments(match);

    return {
      orders,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
  }

  async updateOrderStatus(adminId, orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, 'Order not found');

    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    await order.save();

    await this.logAction(adminId, 'UPDATE_ORDER_STATUS', 'Order', order._id, { oldStatus, newStatus: status });
    notificationService.createOrderNotification(order.user, order._id, order.orderNumber, status).catch(console.error);

    const { emitToOrder, emitToAdmins } = require('../realtime/emitter');
    const eventName = `order:${status.toLowerCase()}`;
    emitToOrder(order._id, eventName, { orderId: order._id, status });
    emitToAdmins('admin:order-updated', { orderId: order._id, status });

    return order;
  }

  // --- PRODUCTS ---
  async getProducts(query) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    let match = {};
    if (search) {
      match.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(match).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(match);

    return {
      products,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
  }

  async createProduct(adminId, data) {
    const product = await Product.create(data);
    await this.logAction(adminId, 'CREATE_PRODUCT', 'Product', product._id, { name: product.name });
    
    const cacheService = require('./cacheService');
    await cacheService.deleteByPattern('product:list:*');
    
    return product;
  }

  async updateProduct(adminId, productId, data) {
    const product = await Product.findByIdAndUpdate(productId, data, { new: true, runValidators: true });
    if (!product) throw new ApiError(404, 'Product not found');
    await this.logAction(adminId, 'UPDATE_PRODUCT', 'Product', product._id, { name: product.name });
    
    const cacheService = require('./cacheService');
    await cacheService.deleteByPattern('product:list:*');
    await cacheService.delete(`product:slug:${product.slug}`);
    
    return product;
  }

  async deleteProduct(adminId, productId) {
    // Soft delete approach by setting active to false
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');
    product.isActive = false;
    await product.save();
    
    await this.logAction(adminId, 'DEACTIVATE_PRODUCT', 'Product', product._id, { name: product.name });
    
    const cacheService = require('./cacheService');
    await cacheService.deleteByPattern('product:list:*');
    await cacheService.delete(`product:slug:${product.slug}`);
    
    return product;
  }

  // --- REVIEWS ---
  async getReviews(query) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    let match = {};
    if (status === 'pending') match.isApproved = false;
    else if (status === 'approved') match.isApproved = true;

    const reviews = await Review.find(match)
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Review.countDocuments(match);

    return {
      reviews,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
  }

  async updateReviewStatus(adminId, reviewId, isApproved) {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Review not found');

    review.isApproved = isApproved;
    await review.save();

    await this.logAction(adminId, 'UPDATE_REVIEW_STATUS', 'Review', review._id, { isApproved });
    
    const { emitToUser, emitToAdmins } = require('../realtime/emitter');
    const eventName = isApproved ? 'review:approved' : 'review:rejected';
    emitToUser(review.user, eventName, { reviewId: review._id, isApproved });
    emitToAdmins('admin:review-updated', { reviewId: review._id, isApproved });
    
    return review;
  }
}

module.exports = new AdminService();
