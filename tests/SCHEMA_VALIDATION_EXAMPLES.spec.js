import { test, expect } from '@playwright/test';
import { headers } from '../config/headers.js';
import { addcustomerdata } from '../testdata/apidata.js';
import APIHelper from '../helpers/apiHelper.js';
import StatusCodeHelper from '../helpers/statusCodeHelper.js';
import TestScenariosHelper from '../helpers/testScenariosHelper.js';

/**
 * SCHEMA VALIDATION EXAMPLES
 * 
 * This test file shows 5 different ways to validate response schemas
 * Copy and use these patterns in your own tests!
 */

test.describe('Schema Validation Examples', () => {

  /**
   * EXAMPLE 1: Simple Schema Validation (Recommended)
   * ✅ Easiest way - validates field existence and types
   */
  test('Example 1: Simple Schema Validation', async ({ request }) => {
    console.log('\n' + '='.repeat(70));
    console.log('EXAMPLE 1: Simple Schema Validation');
    console.log('='.repeat(70));

    const response = await request.post('addcustomer', {
      headers: headers,
      data: addcustomerdata
    });

    const responseBody = await response.json();
    APIHelper.checkStatus(response, 200);

    // ✅ Define what you expect in the response
    const expectedSchema = {
      dkyclink: 'string',      // Should be a string
      customerid: 'number',    // Should be a number
      status: 'string'         // Should be a string
    };

    // ✅ Validate against schema
    StatusCodeHelper.validateSchema(responseBody, expectedSchema, 'Add Customer Response');
    
    console.log('✅ PASSED: Response has correct schema!\n');
  });

  /**
   * EXAMPLE 2: Quick Required Fields Check
   * ✅ For when you just need to verify fields exist
   */
  test('Example 2: Quick Required Fields Check', async ({ request }) => {
    console.log('\n' + '='.repeat(70));
    console.log('EXAMPLE 2: Quick Required Fields Check');
    console.log('='.repeat(70));

    const response = await request.post('addcustomer', {
      headers: headers,
      data: addcustomerdata
    });

    const responseBody = await response.json();
    APIHelper.checkStatus(response, 200);

    // ✅ Just list the fields that must exist
    const requiredFields = ['dkyclink', 'customerid'];

    // ✅ Quick validation
    StatusCodeHelper.validateRequiredFields(responseBody, requiredFields);
    
    console.log('✅ PASSED: All required fields present!\n');
  });

  /**
   * EXAMPLE 3: Single Field Type Validation
   * ✅ For when you need to check specific fields
   */
  test('Example 3: Single Field Type Validation', async ({ request }) => {
    console.log('\n' + '='.repeat(70));
    console.log('EXAMPLE 3: Single Field Type Validation');
    console.log('='.repeat(70));

    const response = await request.post('addcustomer', {
      headers: headers,
      data: addcustomerdata
    });

    const responseBody = await response.json();
    APIHelper.checkStatus(response, 200);

    // ✅ Validate specific fields one by one
    StatusCodeHelper.validateFieldType(responseBody, 'dkyclink', 'string');
    StatusCodeHelper.validateFieldType(responseBody, 'customerid', 'number');
    StatusCodeHelper.validateFieldType(responseBody, 'status', 'string');
    
    console.log('✅ PASSED: All field types are correct!\n');
  });

  /**
   * EXAMPLE 4: Using Test Scenarios Helper with Schema
   * ✅ Full test suite with schema validation included
   */
  test.describe('Example 4: Full Test Suite with Schema Validation', () => {
    TestScenariosHelper.runSchemaValidationTests(
      'addcustomer',
      headers,
      addcustomerdata,
      {
        // Define what fields and types you expect
        successSchema: {
          dkyclink: 'string',
          customerid: 'number',
          status: 'string'
        },
        
        // List fields that must exist
        requiredFields: ['dkyclink', 'customerid'],
        
        // Validate individual field types
        fieldValidations: {
          dkyclink: 'string',
          customerid: 'number',
          status: 'string'
        }
      }
    );
  });

  /**
   * EXAMPLE 5: Complete Testing with Schema (All scenarios)
   * ✅ Runs ALL tests (status codes, auth, schema, etc.) in one call
   */
  test.describe('Example 5: Complete Testing with Schema', () => {
    TestScenariosHelper.runAllTests('addcustomer', headers, addcustomerdata, {
      // Existing options
      requiredFields: ['customerid', 'mobile', 'account_code'],
      requiredSuccessFields: ['dkyclink', 'customerid'],
      validationFields: {
        'mobile': '',
        'account_code': 'INVALID'
      },
      
      // 🆕 NEW: Add schema validation!
      responseSchema: {
        dkyclink: 'string',
        customerid: 'number',
        status: 'string'
      },
      
      // 🆕 NEW: Validate field types
      fieldValidations: {
        dkyclink: 'string',
        customerid: 'number',
        status: 'string'
      }
    });
  });

  /**
   * EXAMPLE 6: Manual Validation Pattern
   * ✅ For complete control over validation
   */
  test('Example 6: Manual Validation with Clear Output', async ({ request }) => {
    console.log('\n' + '='.repeat(70));
    console.log('EXAMPLE 6: Manual Validation with Clear Output');
    console.log('='.repeat(70));

    const response = await request.post('addcustomer', {
      headers: headers,
      data: addcustomerdata
    });

    const responseBody = await response.json();
    APIHelper.checkStatus(response, 200);

    console.log('\nValidating Response Structure:');
    console.log('Expected: { dkyclink: string, customerid: number, status: string }');
    console.log('Received: ' + JSON.stringify(responseBody, null, 2));

    // Manual checks
    expect(responseBody).toHaveProperty('dkyclink');
    expect(typeof responseBody.dkyclink).toBe('string');
    console.log('✅ dkyclink: Present and is string');

    expect(responseBody).toHaveProperty('customerid');
    expect(typeof responseBody.customerid).toBe('number');
    console.log('✅ customerid: Present and is number');

    expect(responseBody).toHaveProperty('status');
    expect(typeof responseBody.status).toBe('string');
    console.log('✅ status: Present and is string');

    console.log('\n✅ PASSED: All validations passed!\n');
  });

});

/**
 * QUICK REFERENCE
 * 
 * Type Names You Can Use:
 * - 'string'    : Text values like "hello"
 * - 'number'    : Numeric values like 123
 * - 'boolean'   : True/false values
 * - 'object'    : Objects like { name: 'john' }
 * - 'array'     : Arrays like [1, 2, 3]
 * - 'null'      : Null values
 * - 'undefined' : Undefined values
 * 
 * Quick Tips:
 * 1. Use validateSchema() for most cases (checks fields + types)
 * 2. Use validateRequiredFields() for quick checks (just fields)
 * 3. Use validateFieldType() for single field validation
 * 4. Use runSchemaValidationTests() for full test suite with schema
 * 5. Use runAllTests() with responseSchema for everything
 */
