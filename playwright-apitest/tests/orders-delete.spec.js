const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { ResponseValidator } = require('../helpers/response-validator');
const {
  VALID_ORDER_REQUEST,
  NON_EXISTENT_ORDER_ID,
  INVALID_ORDER_ID_FORMATS,
} = require('../testdata/api-test-data');
const { ErrorMessages } = require('../testdata/error-messages');

let client;

test.beforeAll(async () => {
  client = await ApiClient.create();
});

test.describe('DELETE /api/orders/{orderId}', () => {
  const errorSchema = {
    status:    { type: 'integer' },
    error:     { type: 'string' },
    message:   { type: 'string' },
    timestamp: { type: 'string' },
  };

  test('happy path — returns 204 for existing order', async () => {
    const createResponse = await client.createOrder(VALID_ORDER_REQUEST);
    const createdOrder = await createResponse.json();

    const deleteResponse = await client.deleteOrder(createdOrder.orderId);

    await ResponseValidator.validateStatusCode(deleteResponse, 204);
    const text = await deleteResponse.text();
    expect(text).toBe('');
  });

  test('not found — returns 404 for non-existent order', async () => {
    const response = await client.deleteOrder(NON_EXISTENT_ORDER_ID);

    await ResponseValidator.validateStatusCode(response, 404);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(404);
    expect(body.error).toBe('Not Found');
    expect(body.message).toBe(ErrorMessages.orderNotFound(NON_EXISTENT_ORDER_ID));
  });

  test('validation — returns 400 for invalid order ID formats', async () => {
    for (const invalidId of INVALID_ORDER_ID_FORMATS) {
      if (invalidId === '') {
        continue;
      }
      const response = await client.deleteOrder(invalidId);

      await ResponseValidator.validateStatusCode(response, 400);
      const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
      expect(body.status).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toBe(ErrorMessages.invalidOrderIdFormat(invalidId));
    }
  });

  test('returns 404 after order has been deleted', async () => {
    const createResponse = await client.createOrder(VALID_ORDER_REQUEST);
    const createdOrder = await createResponse.json();

    await client.deleteOrder(createdOrder.orderId);
    const secondDelete = await client.deleteOrder(createdOrder.orderId);

    await ResponseValidator.validateStatusCode(secondDelete, 404);
    const body = await ResponseValidator.validateResponseSchema(secondDelete, errorSchema);
    expect(body.status).toBe(404);
    expect(body.error).toBe('Not Found');
    expect(body.message).toBe(ErrorMessages.orderNotFound(createdOrder.orderId));
  });
});
