const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { TEST_DATA } = require('../testdata/api-test-data');
const { ERROR_MESSAGES } = require('../testdata/error-messages');
const {
  validateStatusCode,
  validateResponseTime,
} = require('../helpers/response-validator');
const { PRODUCT_UPDATE_PRICE_SCHEMA, PRODUCT_SCHEMA, ERROR_SCHEMA } = require('../testdata/schemas');

test.describe('PUT /api/products/price-update', () => {
  let client;

  test.beforeEach(async ({ request, baseURL }) => {
    client = new ApiClient(request, baseURL);
  });

  test('happy path — returns 200 with updated product for valid payload', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.valid);

    validateStatusCode(response, 200);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(PRODUCT_UPDATE_PRICE_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.productId).toBe(TEST_DATA.priceUpdate.valid.productId);
    expect(body.newPrice).toBe(TEST_DATA.priceUpdate.valid.newPrice);

    await validateResponseTime(response);
  });

  test('validation — returns 400 for negative price', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.negativePrice);

    validateStatusCode(response, 400);

    const body = await response.json();
    for (const [field, expectedType] of Object.entries(ERROR_SCHEMA)) {
      expect(body).toHaveProperty(field);
      expect(typeof body[field]).toBe(expectedType);
    }
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.invalidPriceValue.pattern);
  });

  test('validation — returns 400 for zero price', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.zeroPrice);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.invalidPriceValue.pattern);
  });

  test('validation — returns 400 when productId is missing', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.missingProductId);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.missingRequiredFields.pattern);
  });

  test('validation — returns 400 when newPrice is missing', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.missingPrice);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
    expect(body.message).toMatch(ERROR_MESSAGES.missingRequiredFields.pattern);
  });

  test('not found — returns 404 when product does not exist', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.nonExistentProduct);

    validateStatusCode(response, 404);

    const body = await response.json();
    expect(body.status).toBe(404);
    expect(body.message).toMatch(ERROR_MESSAGES.productNotFound.pattern);
  });

  test('error handling — returns 400 for invalid price data type', async () => {
    const response = await client.updateProductPrice(TEST_DATA.priceUpdate.invalidPriceType);

    validateStatusCode(response, 400);

    const body = await response.json();
    expect(body.status).toBe(400);
  });
});
