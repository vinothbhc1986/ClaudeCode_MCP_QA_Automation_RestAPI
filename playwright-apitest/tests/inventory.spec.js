const { test } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { ResponseValidator } = require('../helpers/response-validator');
const {
  VALID_PRODUCT_ID,
  NON_EXISTENT_PRODUCT_ID,
  INVALID_PRODUCT_ID_FORMATS,
  TEST_INVENTORY,
} = require('../testdata/api-test-data');
const { ErrorMessages } = require('../testdata/error-messages');

let client;

test.beforeAll(async () => {
  client = await ApiClient.create();
});

test.describe('GET /api/inventory/{productId}', () => {
  const inventorySchema = {
    productId:   { type: 'string', pattern: /^PROD-\d{3}$/ },
    productName: { type: 'string' },
    stockStatus: { type: 'string' },
    quantity:    { type: 'integer' },
  };

  const errorSchema = {
    status:    { type: 'integer' },
    error:     { type: 'string' },
    message:   { type: 'string' },
    timestamp: { type: 'string' },
  };

  test('happy path — returns 200 with inventory for valid product', async () => {
    const response = await client.getInventoryById(VALID_PRODUCT_ID);

    await ResponseValidator.validateStatusCode(response, 200);
    const body = await ResponseValidator.validateResponseSchema(response, inventorySchema);

    await ResponseValidator.validateResponseBody(response, {
      productId:   TEST_INVENTORY.productId,
      productName: TEST_INVENTORY.productName,
      stockStatus: TEST_INVENTORY.stockStatus,
      quantity:    TEST_INVENTORY.quantity,
    });

    await ResponseValidator.validateDataTypes(response, {
      productId:   'string',
      productName: 'string',
      stockStatus: 'string',
      quantity:    'integer',
    });
  });

  test('not found — returns 404 for non-existent product ID', async () => {
    const response = await client.getInventoryById(NON_EXISTENT_PRODUCT_ID);

    await ResponseValidator.validateStatusCode(response, 404);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);

    expect(body.status).toBe(404);
    expect(body.error).toBe('Not Found');
    expect(body.message).toBe(ErrorMessages.productNotFound(NON_EXISTENT_PRODUCT_ID));
  });

  test('validation — returns 400 for invalid product ID formats', async () => {
    for (const invalidId of INVALID_PRODUCT_ID_FORMATS) {
      const response = await client.getInventoryById(invalidId || ' ');
      if (invalidId === '') {
        continue;
      }
      await ResponseValidator.validateStatusCode(response, 400);
      const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
      expect(body.status).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toBe(ErrorMessages.invalidProductIdFormat(invalidId));
    }
  });
});
