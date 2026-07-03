import { test, expect } from '@playwright/test';
import { getInventoryById } from '../helpers/api-client.js';
import { validateStatusCode, validateResponseSchema, validateDataTypes, validateResponseTime, validateErrorResponse } from '../helpers/response-validator.js';
import { validProductIds, nonExistentProductId, invalidProductIdFormat } from '../testdata/api-test-data.js';
import { errorMessages } from '../testdata/error-messages.js';

const inventorySchema = {
  productId: 'string',
  productName: 'string',
  stockStatus: 'string',
  quantity: 'number',
};

test.describe('GET /api/inventory/{productId}', () => {

  test('Happy path - should return inventory with 200', async ({ request }) => {
    const response = await getInventoryById(request, validProductIds[0]);
    await validateStatusCode(response, 200);
    const body = await validateResponseSchema(response, inventorySchema);
    await validateDataTypes(body, inventorySchema);
    await validateResponseTime(response);
  });

  test('Not found - should return 404 for non-existent product', async ({ request }) => {
    const response = await getInventoryById(request, nonExistentProductId);
    await validateErrorResponse(response, 404, errorMessages.productNotFound);
  });

  test('Error handling - should return 400 for invalid product ID format', async ({ request }) => {
    const response = await getInventoryById(request, invalidProductIdFormat);
    await validateErrorResponse(response, 400, errorMessages.invalidId);
  });

});
