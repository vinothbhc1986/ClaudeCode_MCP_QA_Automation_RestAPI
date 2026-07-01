const { request } = require('playwright');
const { ENDPOINTS } = require('../testdata/api-endpoints');

class ApiClient {
  constructor(requestContext) {
    this.request = requestContext;
  }

  async getAllProducts() {
    return this.request.get(ENDPOINTS.products());
  }

  async getInventoryById(productId) {
    return this.request.get(ENDPOINTS.inventory(productId));
  }

  async createOrder(payload) {
    return this.request.post(ENDPOINTS.orders(), {
      data: payload,
    });
  }

  async updateProductPrice(payload) {
    return this.request.put(ENDPOINTS.priceUpdate(), {
      data: payload,
    });
  }

  async deleteOrder(orderId) {
    return this.request.delete(ENDPOINTS.orderById(orderId));
  }

  static async create() {
    const ctx = await request.newContext();
    return new ApiClient(ctx);
  }
}

module.exports = { ApiClient };
