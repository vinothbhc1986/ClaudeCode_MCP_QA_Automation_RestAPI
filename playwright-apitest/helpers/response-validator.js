const { expect } = require('@playwright/test');

class ResponseValidator {
  static async validateStatusCode(response, expectedStatus) {
    expect(response.status()).toBe(expectedStatus);
  }

  static async validateResponseBody(response, expectedFields) {
    const body = await response.json();
    for (const [key, value] of Object.entries(expectedFields)) {
      expect(body).toHaveProperty(key);
      if (value !== undefined) {
        expect(body[key]).toEqual(value);
      }
    }
    return body;
  }

  static async validateResponseSchema(response, schemaDefinition) {
    const body = await response.json();
    const validate = (obj, schema) => {
      for (const [key, typeDef] of Object.entries(schema)) {
        expect(obj).toHaveProperty(key);
        if (typeDef.type === 'array') {
          expect(Array.isArray(obj[key])).toBe(true);
          expect(obj[key].length).toBeGreaterThan(0);
          if (typeDef.items) {
            for (const item of obj[key]) {
              validate(item, typeDef.items);
            }
          }
        } else if (typeDef.type === 'string') {
          expect(typeof obj[key]).toBe('string');
          if (typeDef.pattern) {
            expect(obj[key]).toMatch(typeDef.pattern);
          }
        } else if (typeDef.type === 'number') {
          expect(typeof obj[key]).toBe('number');
        } else if (typeDef.type === 'integer') {
          expect(Number.isInteger(obj[key])).toBe(true);
        } else if (typeDef.type === 'object') {
          expect(typeof obj[key]).toBe('object');
          expect(obj[key]).not.toBeNull();
          if (typeDef.properties) {
            validate(obj[key], typeDef.properties);
          }
        } else if (typeDef.type === 'any') {
          expect(obj[key]).toBeDefined();
        }
      }
    };
    const data = Array.isArray(body) ? body : [body];
    for (const item of data) {
      validate(item, schemaDefinition);
    }
    return body;
  }

  static async validateDataTypes(response, typeMap) {
    const body = await response.json();
    const data = Array.isArray(body) ? body : [body];
    for (const item of data) {
      for (const [field, type] of Object.entries(typeMap)) {
        expect(item).toHaveProperty(field);
        if (type === 'string') {
          expect(typeof item[field]).toBe('string');
        } else if (type === 'number') {
          expect(typeof item[field]).toBe('number');
        } else if (type === 'integer') {
          expect(Number.isInteger(item[field])).toBe(true);
        } else if (type === 'boolean') {
          expect(typeof item[field]).toBe('boolean');
        } else if (type === 'object') {
          expect(typeof item[field]).toBe('object');
        }
      }
    }
    return body;
  }

  static async validateResponseTime(response, maxMs = 3000) {
    const timing = response.headers()['request-duration'];
    const duration = timing ? parseInt(timing, 10) : null;
    if (duration !== null) {
      expect(duration).toBeLessThanOrEqual(maxMs);
    }
  }
}

module.exports = { ResponseValidator };
