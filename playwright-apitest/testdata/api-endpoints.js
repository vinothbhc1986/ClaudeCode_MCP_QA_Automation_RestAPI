const ENDPOINTS = {
  products: {
    getAll: '/api/products',
    updatePrice: '/api/products/price-update',
  },
  inventory: {
    getById: (productId) => `/api/inventory/${productId}`,
  },
  orders: {
    create: '/api/orders',
    delete: (orderId) => `/api/orders/${orderId}`,
  },
};

module.exports = { ENDPOINTS };
