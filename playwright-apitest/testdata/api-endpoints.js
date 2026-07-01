const BASE_URL = process.env.BASE_URL || 'http://localhost:8082';

const ENDPOINTS = {
  products:        () => `${BASE_URL}/api/products`,
  inventory:       (productId) => `${BASE_URL}/api/inventory/${productId}`,
  orders:          () => `${BASE_URL}/api/orders`,
  priceUpdate:     () => `${BASE_URL}/api/products/price-update`,
  orderById:       (orderId) => `${BASE_URL}/api/orders/${orderId}`,
};

module.exports = { BASE_URL, ENDPOINTS };
