const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.'],
    default: 1,
  },
  variant: {
    type: String, // Store the size (e.g. '16 oz')
  },
  priceSnapshot: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // Optional: to support guest carts via session/local storage syncing later
    },
    guestId: {
      type: String,
      // For unauthenticated users
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
