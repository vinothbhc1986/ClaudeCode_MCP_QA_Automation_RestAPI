const PRODUCT_SCHEMA = {
  category: 'string',
  name: 'string',
  price: 'number',
  productId: 'string',
  quantity: 'number',
  stockStatus: 'string',
};

const PRODUCT_UPDATE_PRICE_SCHEMA = {
  productId: 'string',
  productName: 'string',
  newPrice: 'number',
  oldPrice: 'number',
  updatedAt: 'string',
};

const INVENTORY_SCHEMA = {
  productId: 'string',
  quantity: 'number',
  stockStatus: 'string',
};

const ORDER_SCHEMA = {
  orderId: 'string',
  productId: 'string',
  quantity: 'number',
  status: 'string',
};

const ERROR_SCHEMA = {
  status: 'number',
  error: 'string',
  message: 'string',
  timestamp: 'string',
};

module.exports = {
  PRODUCT_SCHEMA,
  INVENTORY_SCHEMA,
  ORDER_SCHEMA,
  ERROR_SCHEMA,
  PRODUCT_UPDATE_PRICE_SCHEMA,
};
