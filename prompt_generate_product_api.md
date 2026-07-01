1.  Generate a Spring Boot (Gradle) REST API with these endpoints:
    GET /api/products - Browse all products
    GET /api/inventory/{productId} - Check inventory status for a product
    POST /api/orders - Create a new order
    PUT /api/orders/quantity-update - Update product price
    DELETE /api/orders/{orderId} — Cancel/delete an existing order
    Include proper request/response models and error handling
2.  Create a JSON data file with at least 20 sample products including:
      Product ID, name, price, stock status, category
      No database required - use in-memory storage
3.  Provide instructions to:
    Build and run the API locally
    Test each endpoint manually (with curl commands or browser URLs)
    Expected responses for verification
