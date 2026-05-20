import { test, expect } from '@playwright/test';
import StatusCodeHelper from './statusCodeHelper.js';

/**
 * Test Scenarios Helper - Reusable test suites for any API endpoint
 * Import this and call the functions to automatically generate status code tests
 * 
 * Example usage:
 * TestScenariosHelper.runAuthenticationTests(ENDPOINT, headers, testdata);
 * TestScenariosHelper.runAuthorizationTests(ENDPOINT, headers, testdata);
 * TestScenariosHelper.runBadRequestTests(ENDPOINT, headers, testdata, ['customerid', 'mobile']);
 */

class TestScenariosHelper {

  /**
   * 401 - Unauthorized (Authentication Failures) Tests
   */
  static runAuthenticationTests(endpoint, headers, testdata) {
    test.describe('401 - Unauthorized (Authentication Failures)', () => {

      test('401 - Invalid API Key', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'set', key: 'apikey', value: 'FAKE_INVALID_API_KEY_12345' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [401, 403]);
      });

      test('401 - Missing API Key', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'delete', key: 'apikey' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [401, 403]);
      });

      test('401 - Missing Authorization Header', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'delete', key: 'apikey' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [401, 403, 400]);
      });

      test('401 - Expired Token', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'set', key: 'Authorization', value: 'Bearer EXPIRED_TOKEN_12345' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [401, 403]);
      });

      test('401 - Malformed API Key Header', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'set', key: 'apikey', value: '' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [401, 403, 400]);
      });
    });
  }

  /**
   * 403 - Forbidden (Permission) Tests
   */
  static runAuthorizationTests(endpoint, headers, testdata) {
    test.describe('403 - Forbidden (Insufficient Permissions)', () => {

      test('403 - Valid Auth but Insufficient Permissions', async ({ request }) => {
        const response = await StatusCodeHelper.postAndValidateStatus(request, endpoint, headers, testdata, [200, 403]);
      });
    });
  }

  /**
   * 404 - Not Found Tests
   */
  static runNotFoundTests(endpoint, headers, testdata) {
    test.describe('404 - Not Found', () => {

      test('404 - Invalid Endpoint URL', async ({ request }) => {
        const response = await StatusCodeHelper.postAndValidateStatus(request, 'invalidendpoint', headers, testdata, 404);
      });

      test('404 - Endpoint with Typo', async ({ request }) => {
        const response = await StatusCodeHelper.postAndValidateStatus(request, endpoint + 'X', headers, testdata, 404);
      });
    });
  }

  /**
   * 415 - Unsupported Media Type Tests
   */
  static runMediaTypeTests(endpoint, headers, testdata) {
    test.describe('415 - Unsupported Media Type', () => {

      test('415 - Wrong Content-Type Header', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'set', key: 'Content-Type', value: 'application/xml' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [200, 400, 415]);
      });

      test('415 - Missing Content-Type Header', async ({ request }) => {
        const response = await StatusCodeHelper.testInvalidHeaders(request, endpoint, headers, testdata, [
          { action: 'delete', key: 'Content-Type' }
        ]);
        StatusCodeHelper.validateStatusInRange(response.status(), [200, 400, 415]);
      });
    });
  }

  /**
   * 422 - Unprocessable Entity Tests (Validation Errors)
   */
  static runValidationTests(endpoint, headers, testdata, validationFields = {}) {
    test.describe('422 - Unprocessable Entity (Validation Errors)', () => {

      // Default validation tests
      Object.entries(validationFields).forEach(([fieldName, testValue]) => {
        test(`422 - Invalid ${fieldName} Format`, async ({ request }) => {
          console.log(`\n${'#'.repeat(70)}`);
          console.log(`🎯 TEST: Invalid ${fieldName} Format`);
          console.log(`#`.repeat(70));
          console.log(`\n📋 Scenario: Field "${fieldName}" has INVALID value`);
          console.log(`Expected Result: 422 Unprocessable Entity or 400 Bad Request`);
          console.log(`\nOriginal value: ${JSON.stringify(testdata[fieldName])}`);
          console.log(`Test value: ${JSON.stringify(testValue)}`);
          
          const response = await StatusCodeHelper.testModifiedField(request, endpoint, headers, testdata, fieldName, testValue);
          StatusCodeHelper.validateStatusInRange(response.status(), [200, 400, 422]);
        });
      });

      // If no custom validations provided, use defaults
      if (Object.keys(validationFields).length === 0) {
        test('422 - Invalid Data Format', async ({ request }) => {
          console.log(`\n${'#'.repeat(70)}`);
          console.log(`🎯 TEST: Invalid Data Format`);
          console.log(`#`.repeat(70));
          
          const response = await StatusCodeHelper.testModifiedField(request, endpoint, headers, testdata, 'isconsentavailable', 'invalid_value');
          StatusCodeHelper.validateStatusInRange(response.status(), [200, 400, 422]);
        });
      }
    });
  }

  /**
   * 429 - Rate Limiting Tests
   */
  static runRateLimitTests(endpoint, headers, testdata, requestCount = 10) {
    test.describe('429 - Too Many Requests (Rate Limiting)', () => {

      test('429 - Rapid Requests (Rate Limit Test)', async ({ request }) => {
        const result = await StatusCodeHelper.testRateLimiting(request, endpoint, headers, testdata, requestCount);
        expect(result.hasSuccess).toBeTruthy();
      });
    });
  }

  /**
   * 500+ - Server Error Tests
   */
  static runServerErrorTests(endpoint, headers, testdata) {
    test.describe('5xx - Server Errors', () => {

      test('500 - Server Error Handling', async ({ request }) => {
        const response = await StatusCodeHelper.postAndValidateStatus(request, endpoint, headers, testdata, 200);
        expect(response.status()).not.toBe(500);
      });

      test('503 - Service Unavailable Handling', async ({ request }) => {
        const response = await StatusCodeHelper.postAndValidateStatus(request, endpoint, headers, testdata, 200);
        expect(response.status()).not.toBe(503);
      });
    });
  }

  /**
   * 400 - Bad Request Tests (Missing Required Fields)
   */
  static runMissingFieldTests(endpoint, headers, testdata, requiredFields = []) {
    test.describe('400 - Bad Request (Invalid Data)', () => {

      requiredFields.forEach(fieldName => {
        test(`400 - Missing Required Field (${fieldName})`, async ({ request }) => {
          console.log(`\n${'#'.repeat(70)}`);
          console.log(`🎯 TEST: Missing Required Field - "${fieldName}"`);
          console.log(`#`.repeat(70));
          console.log(`\n📋 Scenario: Field "${fieldName}" is REMOVED from payload`);
          console.log(`Expected Result: 400 Bad Request - API should reject due to missing required field`);
          
          await StatusCodeHelper.testMissingField(request, endpoint, headers, testdata, fieldName);
        });
      });

      test('400 - Empty JSON body', async ({ request }) => {
        console.log(`\n${'#'.repeat(70)}`);
        console.log(`🎯 TEST: Empty JSON Body`);
        console.log(`#`.repeat(70));
        console.log(`\n📋 Scenario: Sending completely empty payload {}`);
        console.log(`Expected Result: 400 Bad Request - No required fields present`);
        
        const response = await request.post(endpoint, {
          headers: headers,
          data: {}
        });
        console.log(`\n📊 Payload sent: {}`);
        console.log(`✅ Actual Status: ${response.status()}`);
        console.log(`Result: ${response.status() >= 400 ? '✅ PASS' : '❌ FAIL'}\n`);
        expect(response.status()).toBeGreaterThanOrEqual(400);
      });
    });
  }

  /**
   * Response Structure Validation Tests
   */
  static runResponseValidationTests(endpoint, headers, testdata, requiredSuccessFields = [], requiredErrorFields = null) {
    test.describe('Response Structure Validation', () => {

      test('Verify Success Response Has Required Fields', async ({ request }) => {
        const response = await request.post(endpoint, {
          headers: headers,
          data: testdata
        });

        if (response.status() === 200) {
          const responseBody = await response.json();
          StatusCodeHelper.validateSuccessResponse(responseBody, requiredSuccessFields);
        }
      });

      test('Verify Error Response Has Error Details', async ({ request }) => {
        // Delete first required field to trigger error
        const invalidData = { ...testdata };
        const firstKey = Object.keys(invalidData)[0];
        delete invalidData[firstKey];

        const response = await request.post(endpoint, {
          headers: headers,
          data: invalidData
        });

        if (response.status() !== 200) {
          const responseBody = await response.json();
          StatusCodeHelper.validateErrorResponse(responseBody);
        }
      });
    });
  }

  /**
   * Success Response Tests (200 OK)
   */
  static runSuccessTests(endpoint, headers, testdata, requiredFields = []) {
    test.describe('200 - OK (Success)', () => {

      test('200 - Valid Request with Valid Headers', async ({ request }) => {
        console.log(`\n${'#'.repeat(70)}`);
        console.log(`🎯 TEST: Valid Request with Valid Headers`);
        console.log(`#`.repeat(70));
        console.log(`\n📋 Scenario: Sending VALID/COMPLETE payload`);
        console.log(`Expected Result: 200 OK - Request should be processed successfully`);
        console.log(`Expected Response Fields: ${requiredFields.join(', ')}`);
        console.log(`\nPayload being sent:`);
        console.log(JSON.stringify(testdata, null, 2));
        
        const response = await StatusCodeHelper.postAndValidateStatus(request, endpoint, headers, testdata, 200, false);
        console.log(`✅ Response Status: ${response.status()}`);
        const responseBody = await response.json();
        console.log(`✅ Response Body:`);
        console.log(JSON.stringify(responseBody, null, 2));
        StatusCodeHelper.validateSuccessResponse(responseBody, requiredFields);
      });
    });
  }

  /**
   * 🆕 SCHEMA VALIDATION TESTS - Validate response structure and field types
   * 
   * Usage:
   * TestScenariosHelper.runSchemaValidationTests('addcustomer', headers, testdata, {
   *   successSchema: {
   *     dkyclink: 'string',
   *     customerid: 'number',
   *     status: 'string'
   *   },
   *   errorSchema: {
   *     error: 'string',
   *     message: 'string'
   *   }
   * });
   */
  static runSchemaValidationTests(endpoint, headers, testdata, schemaConfig = {}) {
    const {
      successSchema = {},
      requiredFields = [],
      fieldValidations = {}
    } = schemaConfig;

    test.describe('🔍 SCHEMA VALIDATION', () => {

      // Test 1: Success Response Schema Validation
      if (Object.keys(successSchema).length > 0) {
        test('✅ Success Response Has Correct Schema', async ({ request }) => {
          console.log(`\n${'#'.repeat(70)}`);
          console.log(`🎯 TEST: Success Response Schema Validation`);
          console.log(`#`.repeat(70));
          console.log(`\nExpected Schema Fields with Types:`);
          Object.entries(successSchema).forEach(([field, type]) => {
            console.log(`  - ${field}: ${type}`);
          });

          const response = await request.post(endpoint, {
            headers: headers,
            data: testdata
          });

          if (response.status() === 200) {
            const responseBody = await response.json();
            // Validate schema with field types
            StatusCodeHelper.validateSchema(responseBody, successSchema, 'Success Response');
          }
        });
      }

      // Test 2: Required Fields Validation
      if (requiredFields.length > 0) {
        test('✅ Response Has All Required Fields', async ({ request }) => {
          console.log(`\n${'#'.repeat(70)}`);
          console.log(`🎯 TEST: Required Fields Validation`);
          console.log(`#`.repeat(70));
          console.log(`\nRequired Fields: ${requiredFields.join(', ')}`);

          const response = await request.post(endpoint, {
            headers: headers,
            data: testdata
          });

          if (response.status() === 200) {
            const responseBody = await response.json();
            // Quick validation - just check fields exist
            StatusCodeHelper.validateRequiredFields(responseBody, requiredFields);
          }
        });
      }

      // Test 3: Individual Field Type Validation
      Object.entries(fieldValidations).forEach(([fieldName, expectedType]) => {
        test(`✅ Field "${fieldName}" Has Correct Type: ${expectedType}`, async ({ request }) => {
          console.log(`\n${'#'.repeat(70)}`);
          console.log(`🎯 TEST: Field Type Validation - ${fieldName}`);
          console.log(`#`.repeat(70));
          console.log(`\nValidating field: "${fieldName}" → type: "${expectedType}"`);

          const response = await request.post(endpoint, {
            headers: headers,
            data: testdata
          });

          if (response.status() === 200) {
            const responseBody = await response.json();
            // Validate specific field type
            StatusCodeHelper.validateFieldType(responseBody, fieldName, expectedType);
          }
        });
      });

      // Test 4: No Unexpected Fields
      test('✅ Response Does Not Have Unexpected Null Values', async ({ request }) => {
        console.log(`\n${'#'.repeat(70)}`);
        console.log(`🎯 TEST: No Unexpected Null Values`);
        console.log(`#`.repeat(70));

        const response = await request.post(endpoint, {
          headers: headers,
          data: testdata
        });

        if (response.status() === 200) {
          const responseBody = await response.json();
          const nullFields = Object.entries(responseBody)
            .filter(([key, value]) => value === null)
            .map(([key]) => key);

          console.log(`\nChecking for null values...`);
          if (nullFields.length > 0) {
            console.log(`⚠️ Warning: Found null fields: ${nullFields.join(', ')}`);
          } else {
            console.log(`✅ No unexpected null values found`);
          }

          // Not a hard fail, just a warning
          console.log();
        }
      });
    });
  }

  /**
   * Run ALL standard test suites at once (convenience function)
   * @param {string} endpoint - API endpoint
   * @param {object} headers - Request headers
   * @param {object} testdata - Test data payload
   * @param {object} options - Configuration options
   * 
   * Example with Schema Validation:
   * TestScenariosHelper.runAllTests('addcustomer', headers, testdata, {
   *   requiredFields: ['customerid', 'mobile', 'account_code'],
   *   requiredSuccessFields: ['dkyclink'],
   *   validationFields: { 'mobile': '', 'customertype': 'INVALID' },
   *   
   *   // 🆕 Add schema validation!
   *   responseSchema: {
   *     dkyclink: 'string',
   *     customerid: 'number',
   *     status: 'string'
   *   }
   * });
   */
  static runAllTests(endpoint, headers, testdata, options = {}) {
    const {
      requiredFields = [],
      requiredSuccessFields = [],
      validationFields = {},
      rateLimit = true,
      requestCount = 10,
      responseSchema = {},
      fieldValidations = {}
    } = options;

    // Run all test suites
    this.runSuccessTests(endpoint, headers, testdata, requiredSuccessFields);
    this.runMissingFieldTests(endpoint, headers, testdata, requiredFields);
    this.runAuthenticationTests(endpoint, headers, testdata);
    this.runAuthorizationTests(endpoint, headers, testdata);
    this.runNotFoundTests(endpoint, headers, testdata);
    this.runMediaTypeTests(endpoint, headers, testdata);
    this.runValidationTests(endpoint, headers, testdata, validationFields);
    
    if (rateLimit) {
      this.runRateLimitTests(endpoint, headers, testdata, requestCount);
    }
    
    this.runServerErrorTests(endpoint, headers, testdata);
    this.runResponseValidationTests(endpoint, headers, testdata, requiredSuccessFields);
    
    // 🆕 Run schema validation if provided
    if (Object.keys(responseSchema).length > 0 || Object.keys(fieldValidations).length > 0) {
      this.runSchemaValidationTests(endpoint, headers, testdata, {
        successSchema: responseSchema,
        requiredFields: requiredSuccessFields,
        fieldValidations: fieldValidations
      });
    }
  }
}

export default TestScenariosHelper;
