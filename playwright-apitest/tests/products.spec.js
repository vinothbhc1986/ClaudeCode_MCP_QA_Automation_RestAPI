const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { ResponseValidator } = require('../helpers/response-validator');

let client;

test.beforeAll(async () => {
  client = await ApiClient.create();
});

test.describe('GET /api/products', () => {
  const productSchema = {
    productId:   { type: 'string', pattern: /^PROD-\d{3}$/ },
    name:        { type: 'string' },
    price:       { type: 'number' },
    stockStatus: { type: 'string' },
    category:    { type: 'string' },
    quantity:    { type: 'integer' },
  };

  test('happy path — returns 200 with all products', async () => {
    const response = await client.getAllProducts();

    await ResponseValidator.validateStatusCode(response, 200);
    const body = await ResponseValidator.validateResponseSchema(response, productSchema);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('response body field names and data types', async () => {
    const response = await client.getAllProducts();

    const body = await ResponseValidator.validateDataTypes(response, {
      productId:   'string',
      name:        'string',
      price:       'number',
      stockStatus: 'string',
      category:    'string',
      quantity:    'integer',
    });

    for (const product of body) {
      expect(product).toHaveProperty('productId');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stockStatus');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('quantity');
    }
  });

  test('returns all expected categories', async () => {
    const response = await client.getAllProducts();
    const body = await response.json();
    const categories = [...new Set(body.map(p => p.category))];
    expect(categories).toContain('Electronics');
    expect(categories).toContain('Books');
    expect(categories).toContain('Home & Kitchen');
    expect(categories).toContain('Sports');
    expect(categories).toContain('Clothing');
  });

  test('returns products with valid stock status values', async () => {
    const response = await client.getAllProducts();
    const body = await response.json();
    const validStatuses = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'];
    for (const product of body) {
      expect(validStatuses).toContain(product.stockStatus);
    }
  });
});
