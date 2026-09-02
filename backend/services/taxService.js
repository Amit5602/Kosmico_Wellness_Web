class TaxService {
  /**
   * Calculates tax based on subtotal and shipping address.
   * Basic foundation: 0% tax for now, configurable.
   */
  calculateTax(subtotal, shippingAddress) {
    const taxRate = 0.0; // Configurable tax rate
    // Round to 2 decimal places
    return Math.round(subtotal * taxRate * 100) / 100;
  }
}

module.exports = new TaxService();
