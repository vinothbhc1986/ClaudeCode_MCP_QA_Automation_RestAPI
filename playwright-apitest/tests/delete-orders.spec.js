const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { TEST_DATA } = require('../testdata/api-test-data');
const { ERROR_MESSAGES } = require('../testdata/error-messages');
const {
  validateStatusCode,
  validateResponseTime,
} = require('../helpers/response-validator');
const { ERROR_SCHEMA } = require('../testdata/schemas');

test.describe('DELETE /api/orders/{orderId}', () => {
  let client;
  let createdOrderId;

  test.beforeEach(async ({ request, baseURL }) => {
    client = new ApiClient(request, baseURL);
  });

  test('happy path — returns 204 when cancelling an existing order', async () => {
    // First create an order to delete
    const createResponse = await client.createOrder(TEST_DATA.orders.valid);
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    createdOrderId = created.orderId;

    const deleteResponse = await client.deleteOrder(createdOrderId);

    validateStatusCode(deleteResponse, 204);

    // 204 No Content — body should be empty
    const text = await deleteResponse.text();
    expect(text).toBe('');

    await validateResponseTime(deleteResponse);
  });

  test('not found — returns 404 for a non-existent order ID', async () => {
    const response = await client.deleteOrder(TEST_DATA.orders.nonExistentOrderId);

    validateStatusCode(response, 404);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(ERROR_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.status).toBe(404);
    expect(body.message).toMatch(ERROR_MESSAGES.orderNotFound.pattern);
  });

  test('invalid ID — returns 400 for an invalidly formatted order ID', async () => {
    const response = await client.deleteOrder(TEST_DATA.orders.invalidOrderId);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('message');
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.invalidId.pattern);
  });

  test('idempotency — second delete on same order ID returns 404', async () => {
    // Create and delete an order
    const createResponse = await client.createOrder(TEST_DATA.orders.valid);
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    const orderId = created.orderId;

    const firstDelete = await client.deleteOrder(orderId);
    validateStatusCode(firstDelete, 204);

    // Attempt to delete the same order again
    const secondDelete = await client.deleteOrder(orderId);
    validateStatusCode(secondDelete, 404);

    const body = await secondDelete.json();
    expect(body.status).toBe(404);
    expect(body.message).toMatch(ERROR_MESSAGES.orderNotFound.pattern);
  });
});
