class ErrorMessages {
  static productNotFound(id) {
    return `Product not found: ${id}`;
  }

  static invalidProductIdFormat(id) {
    return `Invalid product ID format: ${id}`;
  }

  static orderNotFound(id) {
    return `Order not found: ${id}`;
  }

  static invalidOrderIdFormat(id) {
    return `Invalid order ID format: ${id}`;
  }

  static insufficientStock(name, available, requested) {
    return `Insufficient stock for ${name}. Available: ${available}, Requested: ${requested}`;
  }

  static get PRICE_MUST_BE_POSITIVE() {
    return 'Price must be greater than 0';
  }

  static get QUANTITY_MIN() {
    return 'Quantity must be at least 1';
  }

  static get PRODUCT_ID_REQUIRED() {
    return 'productId: productId is required';
  }

  static get QUANTITY_REQUIRED() {
    return 'quantity: quantity is required';
  }

  static get NEW_PRICE_REQUIRED() {
    return 'newPrice: newPrice is required';
  }

  static get INVALID_REQUEST_BODY() {
    return 'Invalid request body or data type';
  }
}

module.exports = { ErrorMessages };
