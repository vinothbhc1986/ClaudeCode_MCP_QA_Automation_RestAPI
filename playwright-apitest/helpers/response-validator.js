import { expect } from '@playwright/test';

export async function validateStatusCode(response, expectedStatus) {
  expect(response.status()).toBe(expectedStatus);
}

export async function validateResponseBody(response, expectedFields) {
  const body = await response.json();
  for (const [key, value] of Object.entries(expectedFields)) {
    expect(body).toHaveProperty(key);
    if (value !== undefined) {
      expect(body[key]).toEqual(value);
    }
  }
  return body;
}

export async function validateResponseSchema(response, schema) {
  const body = await response.json();
  const items = Array.isArray(body) ? body : [body];
  for (const item of items) {
    for (const [key, type] of Object.entries(schema)) {
      expect(item).toHaveProperty(key);
      expect(typeof item[key]).toBe(type);
    }
  }
  return body;
}

export async function validateDataTypes(body, typeMap) {
  const items = Array.isArray(body) ? body : [body];
  for (const item of items) {
    for (const [key, jsType] of Object.entries(typeMap)) {
      expect(item).toHaveProperty(key);
      expect(typeof item[key]).toBe(jsType);
    }
  }
}

export async function validateResponseTime(response, maxMs = 5000) {
  const timing = response.headers()['request-duration'] || response.headers()['x-response-time'];
  if (timing) {
    const duration = parseInt(timing, 10);
    expect(duration).toBeLessThan(maxMs);
  }
}

export async function validateErrorResponse(response, expectedStatus, expectedMessageFragment) {
  expect(response.status()).toBe(expectedStatus);
  const body = await response.json();
  expect(body).toHaveProperty('error');
  if (expectedMessageFragment) {
    expect(body.message || body.error).toContain(expectedMessageFragment);
  }
}
