class ShippingService {
  /**
   * Calculates shipping cost based on cart subtotal and shipping address.
   * Free shipping over $50 as specified in Phase 8 details.
   */
  calculateShipping(subtotal, shippingAddress) {
    if (subtotal >= 50) {
      return 0; // Free shipping
    }
    return 5.99; // Standard flat rate
  }
}

module.exports = new ShippingService();
