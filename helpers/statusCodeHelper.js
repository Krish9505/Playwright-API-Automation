import { expect } from '@playwright/test';

/**
 * Status Code Helper - Centralized utility for API status code testing
 * Reduces code duplication across multiple test scenarios
 */
class StatusCodeHelper {
  
  /**
   * Log request details for debugging
   */
  static logRequestDetails(label, endpoint, headers, data, response) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📤 [${label}] REQUEST DETAILS`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Method: POST`);
    console.log(`Status: ${response.status()}`);
    console.log(`\nHeaders:`);
    console.log(JSON.stringify(headers, null, 2));
    console.log(`\nPayload (Data Sent):`);
    console.log(JSON.stringify(data, null, 2));
    console.log(`${'='.repeat(60)}\n`);
  }

  /**
   * Log response details
   */
  static async logResponseDetails(label, response) {
    const responseBody = await response.json();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📥 [${label}] RESPONSE DETAILS`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Status: ${response.status()}`);
    console.log(`Response Body:`);
    console.log(JSON.stringify(responseBody, null, 2));
    console.log(`${'='.repeat(60)}\n`);
    return responseBody;
  }
  
  /**
   * Make a POST request and validate status code
   */
  static async postAndValidateStatus(request, endpoint, headers, data, expectedStatus, logDetails = true) {
    if (logDetails) {
      this.logRequestDetails(`POST ${endpoint}`, endpoint, headers, data, { status: () => 'pending' });
    }

    const response = await request.post(endpoint, {
      headers: headers,
      data: data
    });

    if (logDetails) {
      console.log(`📊 Expected Status: ${Array.isArray(expectedStatus) ? expectedStatus.join(' or ') : expectedStatus}`);
      console.log(`✅ Actual Status: ${response.status()}\n`);
    }

    if (Array.isArray(expectedStatus)) {
      expect(expectedStatus).toContain(response.status());
    } else {
      expect(response.status()).toBe(expectedStatus);
    }

    return response;
  }

  /**
   * Validate multiple possible status codes
   */
  static validateStatusInRange(status, validStatuses) {
    expect(validStatuses).toContain(status);
  }

  /**
   * Test with missing required field
   */
  static async testMissingField(request, endpoint, headers, data, fieldName) {
    const invalidData = { ...data };
    delete invalidData[fieldName];

    console.log(`\n🚫 Testing MISSING FIELD: "${fieldName}"`);
    console.log(`Removed field from payload`);
    console.log(`\nPayload sent (without ${fieldName}):`);
    console.log(JSON.stringify(invalidData, null, 2));

    const response = await request.post(endpoint, {
      headers: headers,
      data: invalidData
    });

    console.log(`Expected: Status >= 400 (Bad Request)`);
    console.log(`Received: Status ${response.status()}`);
    console.log(`Result: ${response.status() >= 400 ? '✅ PASS' : '❌ FAIL'}\n`);

    expect(response.status()).toBeGreaterThanOrEqual(400);
    return response;
  }

  /**
   * Test with modified field value
   */
  static async testModifiedField(request, endpoint, headers, data, fieldName, newValue) {
    const modifiedData = { ...data, [fieldName]: newValue };

    console.log(`\n⚠️ Testing MODIFIED FIELD: "${fieldName}"`);
    console.log(`Original value: ${JSON.stringify(data[fieldName])}`);
    console.log(`New value: ${JSON.stringify(newValue)}`);
    console.log(`\nPayload sent (with modified ${fieldName}):`);
    console.log(JSON.stringify(modifiedData, null, 2));

    const response = await request.post(endpoint, {
      headers: headers,
      data: modifiedData
    });

    console.log(`Response status: ${response.status()}\n`);
    return response;
  }

  /**
   * Test with invalid headers
   */
  static async testInvalidHeaders(request, endpoint, headers, data, headerMods) {
    const invalidHeaders = { ...headers };
    
    console.log(`\n🔐 Testing INVALID HEADERS`);
    console.log(`Header modifications:`);
    headerMods.forEach(mod => {
      if (mod.action === 'delete') {
        console.log(`  ❌ DELETE: "${mod.key}"`);
        delete invalidHeaders[mod.key];
      } else if (mod.action === 'set') {
        console.log(`  ✏️ SET: "${mod.key}" = "${mod.value}"`);
        invalidHeaders[mod.key] = mod.value;
      }
    });

    console.log(`\nHeaders sent:`);
    console.log(JSON.stringify(invalidHeaders, null, 2));
    console.log(`\nPayload sent:`);
    console.log(JSON.stringify(data, null, 2));

    const response = await request.post(endpoint, {
      headers: invalidHeaders,
      data: data
    });

    console.log(`Response status: ${response.status()}\n`);
    return response;
  }

  /**
   * Test rapid requests for rate limiting
   */
  static async testRateLimiting(request, endpoint, headers, data, requestCount = 10) {
    console.log(`\n⚡ Testing RATE LIMITING`);
    console.log(`Sending ${requestCount} rapid requests...`);
    console.log(`Payload:`);
    console.log(JSON.stringify(data, null, 2));

    const promises = [];
    
    for (let i = 0; i < requestCount; i++) {
      promises.push(
        request.post(endpoint, {
          headers: headers,
          data: data
        })
      );
    }

    const responses = await Promise.all(promises);
    const statuses = responses.map(r => r.status());

    console.log(`\nResponse Status Breakdown:`);
    const statusCounts = {};
    statuses.forEach(status => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} request(s)`);
    });

    return {
      responses,
      statuses,
      successCount: statuses.filter(s => s === 200 || s === 201).length,
      hasSuccess: statuses.some(s => s === 200 || s === 201),
      hasRateLimit: statuses.some(s => s === 429)
    };
  }

  /**
   * Validate response structure for success
   */
  static validateSuccessResponse(responseBody, requiredFields = []) {
    console.log(`\n✅ Validating SUCCESS Response Structure`);
    console.log(`Required fields: ${requiredFields.join(', ')}`);
    console.log(`Response body:`);
    console.log(JSON.stringify(responseBody, null, 2));
    
    requiredFields.forEach(field => {
      const hasField = field in responseBody;
      console.log(`  ${hasField ? '✅' : '❌'} ${field}: ${hasField ? 'Present' : 'MISSING'}`);
      expect(responseBody).toHaveProperty(field);
    });
    console.log();
  }

  /**
   * Validate response structure for error
   */
  static validateErrorResponse(responseBody) {
    console.log(`\n❌ Validating ERROR Response Structure`);
    console.log(`Response body:`);
    console.log(JSON.stringify(responseBody, null, 2));

    const hasError = 
      responseBody.error || 
      responseBody.message || 
      responseBody.errors || 
      Object.keys(responseBody).length > 0;
    
    console.log(`Has error information: ${hasError ? '✅ YES' : '❌ NO'}\n`);
    expect(hasError).toBeTruthy();
  }

  /**
   * SCHEMA VALIDATION - Easy way to validate response structure
   * 
   * Usage:
   * const schema = {
   *   dkyclink: 'string',
   *   customerid: 'number',
   *   status: 'string'
   * };
   * StatusCodeHelper.validateSchema(responseBody, schema, 'Success Response');
   */
  static validateSchema(responseBody, expectedSchema, label = 'Response') {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 SCHEMA VALIDATION: ${label}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\nExpected Schema:`, JSON.stringify(expectedSchema, null, 2));
    console.log(`\nActual Response:`, JSON.stringify(responseBody, null, 2));
    console.log(`\nValidation Results:`);

    let allValid = true;
    const results = [];

    Object.entries(expectedSchema).forEach(([fieldName, expectedType]) => {
      const fieldExists = fieldName in responseBody;
      const actualValue = responseBody[fieldName];
      const actualType = this.getType(actualValue);
      const typeMatches = actualType === expectedType;

      const isValid = fieldExists && typeMatches;
      allValid = allValid && isValid;

      const status = isValid ? '✅' : '❌';
      const typeStatus = typeMatches ? '✅' : '❌';

      console.log(`${status} ${fieldName}:`);
      console.log(`    Exists: ${fieldExists ? '✅ YES' : '❌ MISSING'}`);
      console.log(`    Expected Type: ${expectedType}`);
      console.log(`    Actual Type: ${actualType} ${typeStatus}`);
      console.log(`    Value: ${JSON.stringify(actualValue)}`);

      results.push({
        field: fieldName,
        exists: fieldExists,
        expectedType,
        actualType,
        typeMatches,
        isValid
      });
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Overall: ${allValid ? '✅ ALL FIELDS VALID' : '❌ SOME FIELDS INVALID'}`);
    console.log(`${'='.repeat(60)}\n`);

    if (!allValid) {
      const failures = results.filter(r => !r.isValid);
      const failureMsg = failures.map(f => 
        `Field "${f.field}" - Expected ${f.expectedType}, got ${f.actualType || 'MISSING'}`
      ).join('; ');
      throw new Error(`Schema validation failed: ${failureMsg}`);
    }

    expect(allValid).toBeTruthy();
    return results;
  }

  /**
   * Helper method to get JavaScript type as string
   */
  static getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  /**
   * Quick schema validation (just check if fields exist)
   */
  static validateRequiredFields(responseBody, requiredFields = []) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ REQUIRED FIELDS VALIDATION`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Fields to check: ${requiredFields.join(', ')}`);

    const missingFields = [];

    requiredFields.forEach(field => {
      const exists = field in responseBody;
      console.log(`${exists ? '✅' : '❌'} ${field}: ${exists ? 'PRESENT' : 'MISSING'}`);
      
      if (!exists) {
        missingFields.push(field);
      }
    });

    console.log(`${'='.repeat(60)}\n`);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    expect(missingFields.length).toBe(0);
  }

  /**
   * Validate specific field type
   */
  static validateFieldType(responseBody, fieldName, expectedType) {
    const actualValue = responseBody[fieldName];
    const actualType = this.getType(actualValue);
    const isValid = actualType === expectedType;

    console.log(`\n🔍 Field Type Validation: "${fieldName}"`);
    console.log(`Expected: ${expectedType}, Actual: ${actualType}`);
    console.log(`Result: ${isValid ? '✅ PASS' : '❌ FAIL'}\n`);

    if (!isValid) {
      throw new Error(`Field "${fieldName}" has type ${actualType}, expected ${expectedType}`);
    }

    expect(actualType).toBe(expectedType);
  }

  /**
   * Log response for debugging
   */
  static logResponse(label, response, body) {
    console.log(`\n[${label}] Status: ${response.status()}`);
    console.log(`[${label}] Body:`, body);
  }
}

export default StatusCodeHelper;
