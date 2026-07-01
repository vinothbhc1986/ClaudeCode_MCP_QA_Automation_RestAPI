const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { ResponseValidator } = require('../helpers/response-validator');
const {
  VALID_PRODUCT_ID,
  NON_EXISTENT_PRODUCT_ID,
  VALID_PRICE_UPDATE_REQUEST,
  INVALID_PRICE_UPDATE_MISSING_PRODUCT_ID,
  INVALID_PRICE_UPDATE_MISSING_PRICE,
  INVALID_PRICE_UPDATE_NEGATIVE_PRICE,
  INVALID_PRICE_UPDATE_ZERO_PRICE,
  INVALID_PRICE_UPDATE_WRONG_PRODUCT_ID,
  NEW_PRICE,
} = require('../testdata/api-test-data');
const { ErrorMessages } = require('../testdata/error-messages');

let client;

test.beforeAll(async () => {
  client = await ApiClient.create();
});

test.describe('PUT /api/products/price-update', () => {
  const priceUpdateSchema = {
    productId:   { type: 'string', pattern: /^PROD-\d{3}$/ },
    productName: { type: 'string' },
    oldPrice:    { type: 'number' },
    newPrice:    { type: 'number' },
    updatedAt:   { type: 'string' },
  };

  const errorSchema = {
    status:    { type: 'integer' },
    error:     { type: 'string' },
    message:   { type: 'string' },
    timestamp: { type: 'string' },
  };

  test('happy path — returns 200 with updated price info', async () => {
    const response = await client.updateProductPrice(VALID_PRICE_UPDATE_REQUEST);

    await ResponseValidator.validateStatusCode(response, 200);
    const body = await ResponseValidator.validateResponseSchema(response, priceUpdateSchema);

    expect(body.productId).toBe(VALID_PRICE_UPDATE_REQUEST.productId);
    expect(body.oldPrice).toBeGreaterThan(0);
    expect(body.newPrice).toBe(NEW_PRICE);

    await ResponseValidator.validateDataTypes(response, {
      productId:   'string',
      productName: 'string',
      oldPrice:    'number',
      newPrice:    'number',
      updatedAt:   'string',
    });
  });

  test('validation — returns 400 when productId is missing', async () => {
    const response = await client.updateProductPrice(INVALID_PRICE_UPDATE_MISSING_PRODUCT_ID);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toContain('Product ID');
  });

  test('validation — returns 400 when newPrice is missing', async () => {
    const response = await client.updateProductPrice(INVALID_PRICE_UPDATE_MISSING_PRICE);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toContain(ErrorMessages.NEW_PRICE_REQUIRED);
  });

  test('validation — returns 400 for negative price', async () => {
    const response = await client.updateProductPrice(INVALID_PRICE_UPDATE_NEGATIVE_PRICE);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toBe(ErrorMessages.PRICE_MUST_BE_POSITIVE);
  });

  test('validation — returns 400 for zero price', async () => {
    const response = await client.updateProductPrice(INVALID_PRICE_UPDATE_ZERO_PRICE);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toBe(ErrorMessages.PRICE_MUST_BE_POSITIVE);
  });

  test('not found — returns 404 for non-existent product', async () => {
    const response = await client.updateProductPrice(INVALID_PRICE_UPDATE_WRONG_PRODUCT_ID);

    await ResponseValidator.validateStatusCode(response, 404);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(404);
    expect(body.error).toBe('Not Found');
    expect(body.message).toBe(ErrorMessages.productNotFound(INVALID_PRICE_UPDATE_WRONG_PRODUCT_ID.productId));
  });
});
