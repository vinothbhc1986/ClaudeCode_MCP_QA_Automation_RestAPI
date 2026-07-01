const { ENDPOINTS } = require('../testdata/api-endpoints');

class ApiClient {
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async getAllProducts() {
    const response = await this.request.get(
      `${this.baseURL}${ENDPOINTS.products.getAll}`
    );
    return response;
  }

  async getInventoryById(productId) {
    const response = await this.request.get(
      `${this.baseURL}${ENDPOINTS.inventory.getById(productId)}`
    );
    return response;
  }
  
  async createOrder(orderPayload) {
    const response = await this.request.post(
      `${this.baseURL}${ENDPOINTS.orders.create}`,
      {
        data: orderPayload,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  async updateProductPrice(pricePayload) {
    const response = await this.request.put(
      `${this.baseURL}${ENDPOINTS.products.updatePrice}`,
      {
        data: pricePayload,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  async deleteOrder(orderId) {
    const response = await this.request.delete(
      `${this.baseURL}${ENDPOINTS.orders.delete(orderId)}`
    );
    return response;
  }
}

module.exports = { ApiClient };
