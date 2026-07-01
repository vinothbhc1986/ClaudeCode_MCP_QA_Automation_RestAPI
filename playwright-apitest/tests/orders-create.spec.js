const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { ResponseValidator } = require('../helpers/response-validator');
const {
  VALID_PRODUCT_ID,
  VALID_PRODUCT_ID_LOW_STOCK,
  VALID_ORDER_REQUEST,
  INVALID_ORDER_MISSING_PRODUCT_ID,
  INVALID_ORDER_MISSING_QUANTITY,
  INVALID_ORDER_ZERO_QUANTITY,
  INVALID_ORDER_WRONG_PRODUCT_ID,
} = require('../testdata/api-test-data');
const { ErrorMessages } = require('../testdata/error-messages');

let client;

test.beforeAll(async () => {
  client = await ApiClient.create();
});

test.describe('POST /api/orders', () => {
  const orderSchema = {
    orderId:     { type: 'string', pattern: /^ORD-\d{5}$/ },
    productId:   { type: 'string', pattern: /^PROD-\d{3}$/ },
    productName: { type: 'string' },
    quantity:    { type: 'integer' },
    unitPrice:   { type: 'number' },
    totalPrice:  { type: 'number' },
    status:      { type: 'string' },
    createdAt:   { type: 'string' },
  };

  const errorSchema = {
    status:    { type: 'integer' },
    error:     { type: 'string' },
    message:   { type: 'string' },
    timestamp: { type: 'string' },
  };

  test('happy path — returns 201 with created order', async () => {
    const response = await client.createOrder(VALID_ORDER_REQUEST);

    await ResponseValidator.validateStatusCode(response, 201);
    const body = await ResponseValidator.validateResponseSchema(response, orderSchema);

    expect(body.orderId).toMatch(/^ORD-\d{5}$/);
    expect(body.productId).toBe(VALID_ORDER_REQUEST.productId);
    expect(body.quantity).toBe(VALID_ORDER_REQUEST.quantity);
    expect(body.status).toBe('CONFIRMED');
    expect(body.totalPrice).toBe(body.unitPrice * body.quantity);

    await ResponseValidator.validateDataTypes(response, {
      orderId:     'string',
      productId:   'string',
      productName: 'string',
      quantity:    'integer',
      unitPrice:   'number',
      totalPrice:  'number',
      status:      'string',
      createdAt:   'string',
    });
  });

  test('validation — returns 400 when productId is missing', async () => {
    const response = await client.createOrder(INVALID_ORDER_MISSING_PRODUCT_ID);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toContain(ErrorMessages.PRODUCT_ID_REQUIRED);
  });

  test('validation — returns 400 when quantity is missing', async () => {
    const response = await client.createOrder(INVALID_ORDER_MISSING_QUANTITY);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toContain(ErrorMessages.QUANTITY_REQUIRED);
  });

  test('validation — returns 400 when quantity is zero', async () => {
    const response = await client.createOrder(INVALID_ORDER_ZERO_QUANTITY);

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
  });

  test('not found — returns 404 for non-existent product', async () => {
    const response = await client.createOrder(INVALID_ORDER_WRONG_PRODUCT_ID);

    await ResponseValidator.validateStatusCode(response, 404);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(404);
    expect(body.error).toBe('Not Found');
    expect(body.message).toBe(ErrorMessages.productNotFound(INVALID_ORDER_WRONG_PRODUCT_ID.productId));
  });

  test('error handling — returns 400 for empty request body', async () => {
    const response = await client.createOrder({});

    await ResponseValidator.validateStatusCode(response, 400);
    const body = await ResponseValidator.validateResponseSchema(response, errorSchema);
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
  });
});
