const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const {
  validateStatusCode,
  validateResponseSchema,
  validateDataTypes,
  validateResponseTime,
} = require('../helpers/response-validator');
const { PRODUCT_SCHEMA } = require('../testdata/schemas');

test.describe('GET /api/products', () => {
  let client;

  test.beforeEach(async ({ request, baseURL }) => {
    client = new ApiClient(request, baseURL);
  });

  test('returns 200 with a non-empty array of products', async () => {
    const response = await client.getAllProducts();

    validateStatusCode(response, 200);

    const body = await response.json();
    
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    await validateResponseTime(response);
  });

  test('every product has the correct schema and data types', async () => {
    const response = await client.getAllProducts();

    validateStatusCode(response, 200);
    
    const products = await response.json();
    for (const product of products) {
      for (const [field, expectedType] of Object.entries(PRODUCT_SCHEMA)) {
        expect(product).toHaveProperty(field);
        expect(
          typeof product[field],
          `Product field "${field}" should be "${expectedType}"`
        ).toBe(expectedType);
      }
    }
  });

  test('status field contains a valid stock status value', async () => {
    const validStatuses = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'];
    const response = await client.getAllProducts();

    validateStatusCode(response, 200);

    const products = await response.json();
    for (const product of products) {
      expect(validStatuses).toContain(product.stockStatus);
    }
  });

  test('product prices are positive numbers', async () => {
    const response = await client.getAllProducts();

    validateStatusCode(response, 200);

    const products = await response.json();
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0);
    }
  });

  test('product quantities are non-negative integers', async () => {
    const response = await client.getAllProducts();

    validateStatusCode(response, 200);

    const products = await response.json();
    for (const product of products) {
      expect(product.quantity).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(product.quantity)).toBe(true);
    }
  });
});
