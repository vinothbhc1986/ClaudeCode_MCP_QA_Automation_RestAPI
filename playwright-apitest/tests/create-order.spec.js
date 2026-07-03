import { test, expect } from '@playwright/test';
import { createOrder } from '../helpers/api-client.js';
import { validateStatusCode, validateResponseSchema, validateDataTypes, validateResponseTime, validateErrorResponse } from '../helpers/response-validator.js';
import { validOrderPayload, invalidOrderPayload, partialOrderPayload } from '../testdata/api-test-data.js';
import { errorMessages } from '../testdata/error-messages.js';

const orderSchema = {
  orderId: 'string',
  productId: 'string',
  productName: 'string',
  quantity: 'number',
  unitPrice: 'number',
  totalPrice: 'number',
  status: 'string',
  createdAt: 'string',
};

test.describe('POST /api/orders', () => {

  test('Happy path - should create order with 201', async ({ request }) => {
    const response = await createOrder(request, validOrderPayload);
    await validateStatusCode(response, 201);
    const body = await validateResponseSchema(response, orderSchema);
    await validateDataTypes(body, orderSchema);
    await validateResponseTime(response);
    expect(body.productId).toBe(validOrderPayload.productId);
    expect(body.quantity).toBe(validOrderPayload.quantity);
    expect(body.status).toBe('CONFIRMED');
  });

  test('Validation - missing required fields should return 400', async ({ request }) => {
    const response = await createOrder(request, partialOrderPayload);
    await validateErrorResponse(response, 400, errorMessages.missingRequiredFields);
  });

  test('Error handling - invalid data types should return 400', async ({ request }) => {
    const response = await createOrder(request, invalidOrderPayload);
    await validateErrorResponse(response, 400);
  });

  test('Error handling - empty body should return 400', async ({ request }) => {
    const response = await createOrder(request, {});
    await validateErrorResponse(response, 400);
  });

});
