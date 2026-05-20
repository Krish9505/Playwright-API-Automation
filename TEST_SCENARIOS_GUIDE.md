# Test Scenarios Helper - Complete Guide

## Overview

The `testScenariosHelper.js` provides reusable test functions for all common API status code scenarios. This allows you to test any endpoint with just a few lines of code instead of hundreds of lines.

## Files Structure

```
helpers/
├── statusCodeHelper.js        # Low-level API testing utilities
├── testScenariosHelper.js     # High-level reusable test suites
```

## Quick Start

### 1. For a Single Test Suite

Test only authentication scenarios:

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { mydata } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

const ENDPOINT = 'myendpoint';

test.describe('My Endpoint - Auth Tests', () => {
  TestScenariosHelper.runAuthenticationTests(ENDPOINT, headers, mydata);
});
```

### 2. For All Test Suites (Recommended)

Test all scenarios with one call:

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

const ENDPOINT = 'addcustomer';

test.describe('Add Customer - Status Code Validation', () => {
  TestScenariosHelper.runAllTests(ENDPOINT, headers, addcustomerdata, {
    requiredFields: ['customerid', 'mobile', 'account_code'],
    requiredSuccessFields: ['dkyclink'],
    validationFields: {
      'mobile': 'invalid-mobile',
      'customertype': 'INVALID_TYPE'
    }
  });
});
```

## Available Functions

### Individual Test Suite Functions

Each function generates a complete test suite for a specific scenario:

#### 1. `runSuccessTests(endpoint, headers, testdata, requiredFields)`
Tests successful 200 responses.
```javascript
TestScenariosHelper.runSuccessTests(ENDPOINT, headers, testdata, ['dkyclink']);
```

#### 2. `runMissingFieldTests(endpoint, headers, testdata, requiredFields)`
Tests 400 errors when required fields are missing.
```javascript
TestScenariosHelper.runMissingFieldTests(ENDPOINT, headers, testdata, ['customerid', 'mobile']);
```

#### 3. `runAuthenticationTests(endpoint, headers, testdata)`
Tests 401 authentication failures:
- Invalid API Key
- Missing API Key
- Missing Authorization Header
- Expired Token
- Malformed API Key Header

```javascript
TestScenariosHelper.runAuthenticationTests(ENDPOINT, headers, testdata);
```

#### 4. `runAuthorizationTests(endpoint, headers, testdata)`
Tests 403 permission failures.
```javascript
TestScenariosHelper.runAuthorizationTests(ENDPOINT, headers, testdata);
```

#### 5. `runNotFoundTests(endpoint, headers, testdata)`
Tests 404 endpoint not found errors.
```javascript
TestScenariosHelper.runNotFoundTests(ENDPOINT, headers, testdata);
```

#### 6. `runMediaTypeTests(endpoint, headers, testdata)`
Tests 415 unsupported media type errors.
```javascript
TestScenariosHelper.runMediaTypeTests(ENDPOINT, headers, testdata);
```

#### 7. `runValidationTests(endpoint, headers, testdata, validationFields)`
Tests 422 validation errors.
```javascript
TestScenariosHelper.runValidationTests(ENDPOINT, headers, testdata, {
  'mobile': 'invalid-mobile',
  'ref2': 'not_a_number'
});
```

#### 8. `runRateLimitTests(endpoint, headers, testdata, requestCount)`
Tests 429 rate limiting.
```javascript
TestScenariosHelper.runRateLimitTests(ENDPOINT, headers, testdata, 10);
```

#### 9. `runServerErrorTests(endpoint, headers, testdata)`
Tests 500/503 server error handling.
```javascript
TestScenariosHelper.runServerErrorTests(ENDPOINT, headers, testdata);
```

#### 10. `runResponseValidationTests(endpoint, headers, testdata, requiredSuccessFields)`
Tests response structure validation.
```javascript
TestScenariosHelper.runResponseValidationTests(ENDPOINT, headers, testdata, ['dkyclink']);
```

### Master Function

#### `runAllTests(endpoint, headers, testdata, options)`
Runs ALL test suites at once with a single call.

**Parameters:**
- `endpoint` (string): API endpoint name
- `headers` (object): Request headers
- `testdata` (object): Test data payload
- `options` (object): Configuration options
  - `requiredFields` (array): Fields required for 400 error tests
  - `requiredSuccessFields` (array): Fields expected in success response
  - `validationFields` (object): Field validation tests {fieldName: invalidValue}
  - `rateLimit` (boolean): Enable rate limit tests (default: true)
  - `requestCount` (number): Number of requests for rate limit test (default: 10)

**Example:**
```javascript
TestScenariosHelper.runAllTests(ENDPOINT, headers, testdata, {
  requiredFields: ['customerid', 'mobile'],
  requiredSuccessFields: ['dkyclink'],
  validationFields: { 'mobile': 'invalid', 'type': 'bad' },
  rateLimit: true,
  requestCount: 10
});
```

## Real-World Examples

### Example 1: Add Customer Endpoint

**File:** `tests/01-customer/01-addcustomer-statuscode-CLEAN.spec.js`

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

const ENDPOINT = 'addcustomer';

test.describe('Add Customer - Status Code Validation', () => {
  TestScenariosHelper.runAllTests(ENDPOINT, headers, addcustomerdata, {
    requiredFields: ['customerid', 'mobile', 'account_code'],
    requiredSuccessFields: ['dkyclink'],
    validationFields: {
      'mobile': 'invalid-mobile',
      'isconsentavailable': 'invalid_value',
      'ref2': 'not_a_number',
      'customertype': 'INVALID_TYPE'
    }
  });
});
```

**Generated Tests (Automatic):**
- ✅ 200 - Valid requests
- ✅ 400 - Missing required fields
- ✅ 400 - Invalid field formats
- ✅ 401 - Invalid/missing API keys
- ✅ 401 - Expired tokens
- ✅ 403 - Insufficient permissions
- ✅ 404 - Invalid endpoints
- ✅ 415 - Wrong content-type
- ✅ 422 - Validation errors
- ✅ 429 - Rate limiting
- ✅ 500/503 - Server errors
- ✅ Response structure validation

### Example 2: VCI Details Endpoint

**File:** `tests/01-customer/03-vcipdetails-statuscode.spec.js`

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { getvcipdetails } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

const ENDPOINT = 'vcipdetails';

test.describe('VCI Details - Status Code Validation', () => {
  TestScenariosHelper.runAllTests(ENDPOINT, headers, getvcipdetails, {
    requiredFields: ['vcipref'],
    requiredSuccessFields: ['vcipref'],
    validationFields: { 'vcipref': 'invalid_ref' }
  });
});
```

## Running Tests

### Run all status code tests for an endpoint
```bash
npx playwright test 01-addcustomer-statuscode-CLEAN.spec.js
```

### Run with specific tags
```bash
npx playwright test --grep "401 - Unauthorized"
npx playwright test --grep "400 - Bad Request"
npx playwright test --grep "Response Structure"
```

### Run with debugging
```bash
npx playwright test 01-addcustomer-statuscode-CLEAN.spec.js --debug
```

## Customization

### Add Custom Validation Fields

Modify the `validationFields` object to test specific business logic:

```javascript
validationFields: {
  'mobile': 'abc123',           // Non-numeric mobile
  'email': 'invalid-email',     // Invalid email format
  'age': '-5',                  // Negative age
  'status': 'UNKNOWN',          // Invalid status enum
  'percentage': '150'           // Value exceeds 100%
}
```

### Selective Test Execution

If you only want specific tests:

```javascript
test.describe('My Endpoint - Selective Tests', () => {
  TestScenariosHelper.runAuthenticationTests(ENDPOINT, headers, testdata);
  TestScenariosHelper.runMissingFieldTests(ENDPOINT, headers, testdata, ['customerid']);
  // Skip rate limit and server error tests
});
```

### Disable Rate Limit Tests

If rate limiting isn't supported:

```javascript
TestScenariosHelper.runAllTests(ENDPOINT, headers, testdata, {
  requiredFields: ['id'],
  rateLimit: false  // Disable 429 tests
});
```

## Code Reduction Comparison

### Before (Old Way)
```
Lines of code: 380+
Individual test blocks: 20+
Repeated code: Heavy duplication
Time to create: 30+ minutes
```

### After (New Way)
```
Lines of code: 27
Individual test blocks: Auto-generated (~20+)
Repeated code: 0% duplication
Time to create: 2 minutes
```

**Reduction: ~93% less code! 🎉**

## Benefits

✅ **No Code Duplication** - Write once, use everywhere
✅ **Faster Test Creation** - Create comprehensive tests in minutes
✅ **Consistent Testing** - Same scenarios for all APIs
✅ **Maintainability** - Update helper once, affects all tests
✅ **Scalability** - Test 100 endpoints with minimal code
✅ **Flexibility** - Mix and match test suites as needed

## Tips & Best Practices

1. **Always provide `requiredSuccessFields`** - Ensures response validation works
2. **Use realistic `validationFields`** - Test actual failure scenarios
3. **Test all required fields** - Add them to `requiredFields`
4. **Disable rate limit tests** if not applicable to your API
5. **Review generated tests** - They appear in the Playwright report

## Troubleshooting

**Tests not running?**
- Ensure `ENDPOINT`, `headers`, and `testdata` are correctly imported
- Check endpoint name matches API route exactly

**Assertion failures?**
- Verify `requiredSuccessFields` match actual API response fields
- Check test data is valid and complete

**Rate limit tests timing out?**
- Set `rateLimit: false` if not needed
- Or increase `requestCount` if API has high limits

---

Created: Test Scenarios Helper System
Purpose: Eliminate test duplication and accelerate test development
