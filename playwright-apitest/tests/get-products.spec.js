import { test, expect } from '@playwright/test';
import { getAllProducts } from '../helpers/api-client.js';
import { validateStatusCode, validateResponseSchema, validateDataTypes, validateResponseTime } from '../helpers/response-validator.js';

const productSchema = {
  productId: 'string',
  name: 'string',
  price: 'number',
  category: 'string',
  stockStatus: 'string',
  quantity: 'number',
};

test.describe('GET /api/products', () => {

  test('Happy path - should return all products with 200', async ({ request }) => {
    const response = await getAllProducts(request);
    await validateStatusCode(response, 200);
    const body = await validateResponseSchema(response, productSchema);
    await validateDataTypes(body, productSchema);
    await validateResponseTime(response);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

});
