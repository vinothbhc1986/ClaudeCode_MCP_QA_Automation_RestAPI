const ERROR_MESSAGES = {
  invalidId: {
    pattern: /invalid/i,
    description: 'Invalid ID format provided',
  },
  orderNotFound: {
    pattern: /order.*not found|not found.*order/i,
    description: 'Order does not exist',
  },
  productNotFound: {
    pattern: /product.*not found|not found.*product/i,
    description: 'Product does not exist',
  },
  missingRequiredFields: {
    pattern: /required|missing|must not be null/i,
    description: 'Required fields are missing from request body',
  },
  invalidPriceValue: {
    pattern: /price.*invalid|invalid.*price|price.*positive|must be greater/i,
    description: 'Price value is invalid (negative, zero, or wrong type)',
  },
  invalidQuantity: {
    pattern: /quantity.*invalid|invalid.*quantity|quantity.*positive|must be greater/i,
    description: 'Quantity value is invalid (zero, negative, or wrong type)',
  },
  insufficientStock: {
    pattern: /insufficient stock|out of stock|not enough/i,
    description: 'Not enough stock to fulfill the order',
  },
};

module.exports = { ERROR_MESSAGES };
