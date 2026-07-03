import { test, expect } from '@playwright/test';
import { deleteOrder, createOrder } from '../helpers/api-client.js';
import { validateStatusCode, validateErrorResponse } from '../helpers/response-validator.js';
import { nonExistentOrderId, invalidOrderIdFormat, validOrderPayload } from '../testdata/api-test-data.js';
import { errorMessages } from '../testdata/error-messages.js';

let createdOrderId;

test.describe('DELETE /api/orders/{orderId}', () => {

  test.beforeAll(async ({ request }) => {
    const response = await createOrder(request, validOrderPayload);
    const body = await response.json();
    createdOrderId = body.orderId;
  });

  test('Happy path - should delete order with 204', async ({ request }) => {
    const response = await deleteOrder(request, createdOrderId);
    await validateStatusCode(response, 204);
    const text = await response.text();
    expect(text).toBe('');
  });

  test('Not found - non-existent order should return 404', async ({ request }) => {
    const response = await deleteOrder(request, nonExistentOrderId);
    await validateErrorResponse(response, 404, errorMessages.orderNotFound);
  });

  test('Error handling - invalid order ID format should return 400', async ({ request }) => {
    const response = await deleteOrder(request, invalidOrderIdFormat);
    await validateErrorResponse(response, 400);
  });

});
