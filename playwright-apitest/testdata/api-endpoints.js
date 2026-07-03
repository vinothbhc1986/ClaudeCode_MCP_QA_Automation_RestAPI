const BASE_URL = 'http://localhost:8082';

export const endpoints = {
  getAllProducts: () => `${BASE_URL}/api/products`,
  getInventoryById: (productId) => `${BASE_URL}/api/inventory/${productId}`,
  createOrder: () => `${BASE_URL}/api/orders`,
  updateProductPrice: () => `${BASE_URL}/api/products/price-update`,
  deleteOrder: (orderId) => `${BASE_URL}/api/orders/${orderId}`,
};
