import { endpoints } from '../testdata/api-endpoints.js';

export async function getAllProducts(request) {
  return request.get(endpoints.getAllProducts());
}

export async function getInventoryById(request, productId) {
  return request.get(endpoints.getInventoryById(productId));
}

export async function createOrder(request, payload) {
  return request.post(endpoints.createOrder(), { data: payload });
}

export async function updateProductPrice(request, payload) {
  return request.put(endpoints.updateProductPrice(), { data: payload });
}

export async function deleteOrder(request, orderId) {
  return request.delete(endpoints.deleteOrder(orderId));
}
