import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { getvcipdetails } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

const ENDPOINT = 'vcipdetails';

// ============================================================
// STATUS CODE TESTS FOR VCIPDETAILS ENDPOINT
// ============================================================

test.describe('VCI Details - Status Code Validation', () => {
  
  // Run all standard test scenarios with one function call
  TestScenariosHelper.runAllTests(ENDPOINT, headers, getvcipdetails, {
    // Required fields for 400 error tests
    requiredFields: ['vcipref'],
    
    // Fields to validate in success response
    requiredSuccessFields: ['vcipref'],
    
    // Custom validation tests
    validationFields: {
      'vcipref': 'invalid_ref'
    }
  });

});
