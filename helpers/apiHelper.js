import { expect } from '@playwright/test';

/**
 * API Helper - Simple utilities for API testing
 * Lightweight helpers for basic response handling
 */

class APIHelper {
  /**
   * Check response status
   * @param {Response} response - Playwright response object
   * @param {number} expectedStatus - Expected HTTP status code (default: 200)
   */
  static checkStatus(response, expectedStatus = 200) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Extract value from response
   * @param {object} responseBody - Parsed JSON response
   * @param {string} key - Key to extract
   */
  static getValue(responseBody, key) {
    return responseBody[key];
  }

  /**
   * Check if key exists in response
   * @param {object} responseBody - Parsed JSON response
   * @param {string} key - Key to check
   */
  static hasKey(responseBody, key) {
    return key in responseBody;
  }

  /**
   * Log response nicely
   * @param {object} responseBody - Response body to log
   */
  static log(responseBody) {
    console.log(responseBody);
  }

  /**
   * Verify response has required fields
   * @param {object} responseBody - Response body
   * @param {Array} requiredFields - Fields that must exist
   */
  static validateFields(responseBody, requiredFields = []) {
    requiredFields.forEach((field) => {
      expect(this.hasKey(responseBody, field)).toBeTruthy();
    });
  }

  /**
   * Extract nested value using dot notation
   * @param {object} obj - Object to search
   * @param {string} path - Path like 'user.profile.name'
   */
  static getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  /**
   * Extract URL parameter
   * @param {string} url - URL string
   * @param {string} paramName - Parameter name to extract
   */
  static getUrlParam(url, paramName) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(paramName);
  }

  /**
   * Validate response schema
   * @param {object} responseBody - Response body
   * @param {object} schema - Schema object with types (e.g., { authkey: 'string', status: 'number' })
   */
  static validateSchema(responseBody, schema) {
    Object.entries(schema).forEach(([key, expectedType]) => {
      // Check key exists
      if (!this.hasKey(responseBody, key)) {
        throw new Error(`Field '${key}' is missing from response`);
      }

      // Check type
      const actualType = typeof responseBody[key];
      if (actualType !== expectedType) {
        throw new Error(`Field '${key}' has type '${actualType}' but expected '${expectedType}'`);
      }
    });
    console.log('✅ Schema validation passed');
  }
}

export default APIHelper;
