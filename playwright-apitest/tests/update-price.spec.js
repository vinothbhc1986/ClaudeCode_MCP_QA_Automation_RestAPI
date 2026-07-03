import { test, expect } from '@playwright/test';
import { updateProductPrice } from '../helpers/api-client.js';
import { validateStatusCode, validateResponseSchema, validateDataTypes, validateResponseTime, validateErrorResponse } from '../helpers/response-validator.js';
import { validPriceUpdatePayload, invalidPriceUpdatePayload, partialPriceUpdatePayload, nonExistentPriceUpdatePayload } from '../testdata/api-test-data.js';
import { errorMessages } from '../testdata/error-messages.js';

const priceUpdateSchema = {
  productId: 'string',
  productName: 'string',
  oldPrice: 'number',
  newPrice: 'number',
  updatedAt: 'string',
};

test.describe('PUT /api/products/price-update', () => {

  test('Happy path - should update price with 200', async ({ request }) => {
    const response = await updateProductPrice(request, validPriceUpdatePayload);
    await validateStatusCode(response, 200);
    const body = await validateResponseSchema(response, priceUpdateSchema);
    await validateDataTypes(body, priceUpdateSchema);
    await validateResponseTime(response);
    expect(body.newPrice).toBe(validPriceUpdatePayload.newPrice);
  });

  test('Validation - missing fields should return 400', async ({ request }) => {
    const response = await updateProductPrice(request, partialPriceUpdatePayload);
    await validateErrorResponse(response, 400, errorMessages.missingRequiredFields);
  });

  test('Error handling - invalid price value should return 400', async ({ request }) => {
    const response = await updateProductPrice(request, invalidPriceUpdatePayload);
    await validateErrorResponse(response, 400, errorMessages.invalidPriceValue);
  });

  test('Not found - non-existent product should return 404', async ({ request }) => {
    const response = await updateProductPrice(request, nonExistentPriceUpdatePayload);
    await validateErrorResponse(response, 404, errorMessages.productNotFound);
  });

  test('Error handling - empty body should return 400', async ({ request }) => {
    const response = await updateProductPrice(request, {});
    await validateErrorResponse(response, 400);
  });

});
