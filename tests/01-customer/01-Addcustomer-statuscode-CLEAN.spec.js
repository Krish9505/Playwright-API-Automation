import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';
import { config, currentEnv } from '../../config/env.js';

const ENDPOINT = 'addcustomer';

// ============================================================
// STATUS CODE TESTS FOR ADDCUSTOMER ENDPOINT
// ============================================================

test.describe('Add Customer - Status Code Validation', () => {
  
  // Run all standard test scenarios with one function call
  TestScenariosHelper.runAllTests(ENDPOINT, headers, addcustomerdata, {
    // Required fields for 400 error tests
    requiredFields: ['customerid', 'mobile', 'account_code'],
    
    // Fields to validate in success response
    requiredSuccessFields: ['dkyclink'],
    
    // Custom validation tests
    validationFields: {
      'mobile': 'invalid-mobile',
      'isconsentavailable': 'invalid_value',
      'ref2': 'not_a_number',
      'customertype': 'INVALID_TYPE'
    }
  });

});
