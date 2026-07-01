const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { TEST_DATA } = require('../testdata/api-test-data');
const { ERROR_MESSAGES } = require('../testdata/error-messages');
const {
  validateStatusCode,
  validateDataTypes,
  validateResponseTime,
} = require('../helpers/response-validator');
const { ORDER_SCHEMA, ERROR_SCHEMA } = require('../testdata/schemas');

const ORDER_ID_PATTERN = /^ORD-\d{5}$/;

test.describe('POST /api/orders', () => {
  let client;

  test.beforeEach(async ({ request, baseURL }) => {
    client = new ApiClient(request, baseURL);
  });

  test('happy path — returns 201 with created order for valid payload', async () => {
    const response = await client.createOrder(TEST_DATA.orders.valid);

    validateStatusCode(response, 201);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(ORDER_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.productId).toBe(TEST_DATA.orders.valid.productId);
    expect(body.quantity).toBe(TEST_DATA.orders.valid.quantity);
    expect(body.orderId).toMatch(ORDER_ID_PATTERN);

    await validateResponseTime(response);
  });

  test('created order ID matches expected ORD-NNNNN format', async () => {
    const response = await client.createOrder(TEST_DATA.orders.valid);

    validateStatusCode(response, 201);

    const body = await response.json();
    expect(body.orderId).toMatch(ORDER_ID_PATTERN);
  });

  test('validation — returns 400 when productId is missing', async () => {
    const response = await client.createOrder(TEST_DATA.orders.missingProductId);

    validateStatusCode(response, 400);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(ERROR_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.missingRequiredFields.pattern);
  });

  test('validation — returns 400 when quantity is missing', async () => {
    const response = await client.createOrder(TEST_DATA.orders.missingQuantity);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.missingRequiredFields.pattern);
  });

  test('validation — returns 400 for zero quantity', async () => {
    const response = await client.createOrder(TEST_DATA.orders.zeroQuantity);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
  });

  test('validation — returns 400 for negative quantity', async () => {
    const response = await client.createOrder(TEST_DATA.orders.negativeQuantity);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.invalidQuantity.pattern);
  });

  test('not found — returns 404 when product does not exist', async () => {
    const response = await client.createOrder(TEST_DATA.orders.nonExistentProduct);

    validateStatusCode(response, 404);

    const body = await response.json();
    expect(body.status).toBe(404);
    expect(body.message).toMatch(ERROR_MESSAGES.productNotFound.pattern);
  });

  test('error handling — returns 400 for invalid quantity data type', async () => {
    const response = await client.createOrder(TEST_DATA.orders.invalidQuantityType);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
  });
});
