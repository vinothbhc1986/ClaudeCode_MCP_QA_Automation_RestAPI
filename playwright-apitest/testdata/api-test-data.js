export const validProductIds = ['PROD-001', 'PROD-002', 'PROD-003'];
export const nonExistentProductId = 'PROD-999';
export const invalidProductIdFormat = 'INVALID';

export const validOrderId = 'ORD-00001';
export const nonExistentOrderId = 'ORD-99999';
export const invalidOrderIdFormat = 'INVALID';

export const validOrderPayload = {
  productId: 'PROD-001',
  quantity: 2,
};

export const invalidOrderPayload = {
  productId: 'INVALID',
  quantity: -5,
};

export const partialOrderPayload = {
  productId: 'PROD-001',
};

export const validPriceUpdatePayload = {
  productId: 'PROD-001',
  newPrice: 29.99,
};

export const invalidPriceUpdatePayload = {
  productId: 'PROD-001',
  newPrice: -10,
};

export const partialPriceUpdatePayload = {
  productId: 'PROD-001',
};

export const nonExistentPriceUpdatePayload = {
  productId: 'PROD-999',
  newPrice: 49.99,
};
