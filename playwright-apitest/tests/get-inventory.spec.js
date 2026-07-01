const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { TEST_DATA } = require('../testdata/api-test-data');
const { ERROR_MESSAGES } = require('../testdata/error-messages');
const {
  validateStatusCode,
  validateDataTypes,
  validateResponseTime,
} = require('../helpers/response-validator');
const { INVENTORY_SCHEMA, ERROR_SCHEMA } = require('../testdata/schemas');

test.describe('GET /api/inventory/{productId}', () => {
  let client;

  test.beforeEach(async ({ request, baseURL }) => {
    client = new ApiClient(request, baseURL);
  });

  test('happy path — returns 200 with inventory for a valid product ID', async () => {
    const response = await client.getInventoryById(TEST_DATA.products.validProductId);

    validateStatusCode(response, 200);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(INVENTORY_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.productId).toBe(TEST_DATA.products.validProductId);

    await validateResponseTime(response);
  });

  test('inventory status is a valid enum value', async () => {
    const validStatuses = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'];
    const response = await client.getInventoryById(TEST_DATA.products.validProductId);

    validateStatusCode(response, 200);

    const body = await response.json();
    expect(validStatuses).toContain(body.stockStatus);
  });

  test('quantity is a non-negative integer', async () => {
    const response = await client.getInventoryById(TEST_DATA.products.validProductId);

    validateStatusCode(response, 200);

    const body = await response.json();
    expect(body.quantity).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(body.quantity)).toBe(true);
  });

  test('not found — returns 404 for a non-existent product ID', async () => {
    const response = await client.getInventoryById(TEST_DATA.products.nonExistentProductId);

    validateStatusCode(response, 404);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(ERROR_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.status).toBe(404);
    expect(body.message).toMatch(ERROR_MESSAGES.productNotFound.pattern);
  });

  test('invalid ID — returns 400 for a non-numeric product ID', async () => {
    const response = await client.getInventoryById(TEST_DATA.products.invalidProductId);
    console.log('Response Status:', response.status()); // Debug log to inspect the status code
    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('message');
    expect(body.status).toBe(400);
  });
});
