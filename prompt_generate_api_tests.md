Generate Playwright API test cases only for the Order & Inventory 
Management REST API.

Test the following endpoints:
- GET    /api/products                    - Browse all products
- GET    /api/inventory/{productId}       - Check inventory status
- POST   /api/orders                      - Create a new order
- PUT    /api/products/price-update       - Update product price
- DELETE /api/orders/{orderId}            - Cancel/delete an order

Expected status codes:
- GET    /api/products              → 200
- GET    /api/inventory/{productId} → 200, 404
- POST   /api/orders                → 201, 400
- PUT    /api/products/price-update → 200, 400, 404
- DELETE /api/orders/{orderId}      → 204, 404

Test scenarios to cover for each endpoint:
- Happy path — valid request returns expected response
- Validation — missing or invalid request body/parameters
- Not found — request with non-existent ID returns 404
- Error handling — invalid data types return 400

Validation requirements for every endpoint:

1. Status Code
   - Assert the correct HTTP status code is returned
   - Cover both success and error status codes

2. Response Body
   - Verify correct field names are present
   - Verify field values match the request input
   - Verify data types are correct
   - Verify lists return arrays and not empty responses
   - Verify created resource returns the correct ID

3. Response Schema
   - Validate the structure of every response
   - Define and enforce expected schema per endpoint.
Folder structure requirements:
- playwright-apitest/
  - testdata/
    - api-test-data.js     - All test input data
    - api-endpoints.js     - All API endpoint URLs
    - error-messages.js    - Expected error messages for:
                             invalid ID, order not found,
                             missing required fields,
                             invalid price value
  - helpers/
    - api-client.js        - Reusable API client with methods:
                             getAllProducts()
                             getInventoryById()
                             createOrder()
                             updateProductPrice()
                             deleteOrder()
    - response-validator.js - Validation functions:
                             validateStatusCode()
                             validateResponseBody()
                             validateResponseSchema()
                             validateDataTypes()
                             validateResponseTime()
  - tests/
    - One spec file per endpoint
    - No API logic or hardcoded data in test files
    - Tests must call methods from helpers/api-client.js
    - Tests must use data from testdata folder
    - Tests must validate using helpers/response-validator.js
  - playwright.config.js   - Base URL, timeouts, HTML reporter

Rules:
- Use Playwright with JavaScript
- All test data must come from the testdata folder
- No hardcoded values in test files
- Keep code clean, modular, and maintainable
- Do NOT execute or run the tests
- Do NOT use plan mode
