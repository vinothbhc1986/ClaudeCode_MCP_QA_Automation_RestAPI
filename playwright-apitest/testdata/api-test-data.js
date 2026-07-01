const TEST_DATA = {
  products: {
    validProductId: "PROD-001",
    nonExistentProductId: "PROD-999",
    invalidProductId: 'abc',
  },

  orders: {
    valid: {
      productId: "PROD-001",
      quantity: 2,
    },
    missingProductId: {
      quantity: 2,
    },
    missingQuantity: {
      productId: "PROD-001",
    },
    invalidQuantityType: {
      productId: "PROD-001",
      quantity: 'two',
    },
    zeroQuantity: {
      productId: "PROD-001",
      quantity: 0,
    },
    negativeQuantity: {
      productId: "PROD-001",
      quantity: -1,
    },
    nonExistentProduct: {
      productId: "PROD-999",
      quantity: 1,
    },
    validOrderIdFormat: 'ORD-00001',
    nonExistentOrderId: 'ORD-99999',
    invalidOrderId: 'INVALID-ID',
  },

  priceUpdate: {
    valid: {
      productId: "PROD-001",
      newPrice: 29.99,
    },
    negativePrice: {
      productId: "PROD-001",
      newPrice: -10.00,
    },
    zeroPrice: {
      productId: "PROD-001",
      newPrice: 0,
    },
    invalidPriceType: {
      productId: "PROD-005",
      newPrice: 'free',
    },
    missingProductId: {
      newPrice: 19.99,
    },
    missingPrice: {
      productId: "PROD-001",
    },
    nonExistentProduct: {
      productId: "PROD-999",
      newPrice: 19.99,
    },
  },
};

module.exports = { TEST_DATA };
