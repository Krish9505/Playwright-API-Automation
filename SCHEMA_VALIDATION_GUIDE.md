# 🔍 SCHEMA VALIDATION - HOW TO USE

## ✨ QUICK START

You now have **3 easy ways** to validate response schemas:

---

## **Method 1: Using statusCodeHelper directly** (Simplest)

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import StatusCodeHelper from '../../helpers/statusCodeHelper.js';

test('add customer - with schema validation', async ({ request }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });

  const responseBody = await response.json();

  // ✅ Method 1: Validate with field types
  const schema = {
    dkyclink: 'string',      // Expect string type
    customerid: 'number',    // Expect number type
    status: 'string'         // Expect string type
  };
  
  StatusCodeHelper.validateSchema(responseBody, schema, 'Add Customer Response');
});
```

**Output:**
```
✅ SCHEMA VALIDATION: Add Customer Response
Expected Schema: { dkyclink: 'string', customerid: 'number', status: 'string' }
Actual Response: { dkyclink: '12345', customerid: 999, status: 'active' }

Validation Results:
✅ dkyclink:
    Exists: ✅ YES
    Expected Type: string
    Actual Type: string ✅
    Value: "12345"

✅ customerid:
    Exists: ✅ YES
    Expected Type: number
    Actual Type: number ✅
    Value: 999

✅ status:
    Exists: ✅ YES
    Expected Type: string
    Actual Type: string ✅
    Value: "active"

============================================================
Overall: ✅ ALL FIELDS VALID
```

---

## **Method 2: Just check if required fields exist** (Quick Check)

```javascript
import StatusCodeHelper from '../../helpers/statusCodeHelper.js';

test('verify required fields', async ({ request }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });

  const responseBody = await response.json();

  // ✅ Method 2: Quick required fields check
  const requiredFields = ['dkyclink', 'customerid', 'status'];
  StatusCodeHelper.validateRequiredFields(responseBody, requiredFields);
});
```

**Output:**
```
============================================================
✅ REQUIRED FIELDS VALIDATION
Fields to check: dkyclink, customerid, status
✅ dkyclink: PRESENT
✅ customerid: PRESENT
✅ status: PRESENT
============================================================
```

---

## **Method 3: Validate single field type** (For specific fields)

```javascript
import StatusCodeHelper from '../../helpers/statusCodeHelper.js';

test('verify dkyclink is string', async ({ request }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });

  const responseBody = await response.json();

  // ✅ Method 3: Validate specific field type
  StatusCodeHelper.validateFieldType(responseBody, 'dkyclink', 'string');
  StatusCodeHelper.validateFieldType(responseBody, 'customerid', 'number');
});
```

**Output:**
```
🔍 Field Type Validation: "dkyclink"
Expected: string, Actual: string
Result: ✅ PASS
```

---

## **Method 4: Using testScenariosHelper** (Full Test Suite with Schema)

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

test.describe('Add Customer - Complete Testing with Schema Validation', () => {
  TestScenariosHelper.runAllTests('addcustomer', headers, addcustomerdata, {
    requiredFields: ['customerid', 'mobile', 'account_code'],
    requiredSuccessFields: ['dkyclink', 'customerid', 'status'],
    
    // 🆕 NEW: Add schema validation!
    responseSchema: {
      dkyclink: 'string',
      customerid: 'number',
      status: 'string'
    },
    
    // 🆕 NEW: Validate individual fields
    fieldValidations: {
      dkyclink: 'string',
      customerid: 'number',
      status: 'string'
    },
    
    validationFields: {
      'mobile': '',
      'account_code': 'INVALID'
    }
  });
});
```

This runs **ALL tests** including:
- ✅ Success response (200)
- ❌ Missing fields (400)
- 🔐 Auth failures (401)
- 🚫 Invalid data (422)
- 🔍 **Schema validation** (NEW!)
- 📊 Response structure
- And many more...

---

## **Method 5: Run ONLY schema validation** (Just the schema tests)

```javascript
import { test } from '@playwright/test';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';

test.describe('Add Customer - Schema Validation Only', () => {
  TestScenariosHelper.runSchemaValidationTests(
    'addcustomer', 
    headers, 
    addcustomerdata, 
    {
      successSchema: {
        dkyclink: 'string',
        customerid: 'number',
        status: 'string'
      },
      requiredFields: ['dkyclink', 'customerid'],
      fieldValidations: {
        dkyclink: 'string',
        customerid: 'number',
        status: 'string'
      }
    }
  );
});
```

---

## 📚 Field Types You Can Use

```javascript
'string'      // Text: "hello", "john@example.com"
'number'      // Integers: 123, 456
'boolean'     // True/False: true, false
'object'      // Objects: { name: 'john' }
'array'       // Arrays: [1, 2, 3]
'null'        // Null value: null
'undefined'   // Undefined: undefined
```

---

## 🎯 Real Examples for Your Project

### Example 1: Add Customer Response
```javascript
// Expected response schema
{
  dkyclink: 'string',        // "https://kyc.com/v/abc123"
  customerid: 'number',      // 12345
  status: 'string',          // "PENDING"
  createdAt: 'string'        // "2024-05-18"
}

// Usage
StatusCodeHelper.validateSchema(response, {
  dkyclink: 'string',
  customerid: 'number',
  status: 'string',
  createdAt: 'string'
}, 'Add Customer Response');
```

### Example 2: OCR Response
```javascript
// Expected response schema
{
  ocrData: 'object',         // { text: '...', confidence: 0.95 }
  documentType: 'string',    // "PASSPORT"
  isVerified: 'boolean'      // true/false
}

// Usage
StatusCodeHelper.validateSchema(response, {
  ocrData: 'object',
  documentType: 'string',
  isVerified: 'boolean'
}, 'OCR Response');
```

### Example 3: Error Response
```javascript
// Expected error response schema
{
  error: 'string',           // "INVALID_DATA"
  message: 'string',         // "Mobile field is required"
  statusCode: 'number'       // 400
}

// Usage
StatusCodeHelper.validateSchema(response, {
  error: 'string',
  message: 'string',
  statusCode: 'number'
}, 'Error Response');
```

---

## ✅ What Gets Checked

The schema validation checks:

| Check | Details |
|-------|---------|
| **Field Exists** | Is the field present in response? |
| **Field Type** | Is the field the correct type? |
| **Not Null** | Is the value not null? |
| **Not Undefined** | Is the value defined? |

---

## ⚠️ Common Mistakes

```javascript
// ❌ WRONG: Field name not in response
StatusCodeHelper.validateSchema(response, {
  wrongFieldName: 'string'
});
// Error: wrongFieldName is MISSING

// ❌ WRONG: Wrong expected type
StatusCodeHelper.validateSchema(response, {
  dkyclink: 'number'  // But it's actually a string
});
// Error: Expected number, got string

// ✅ RIGHT: Correct field and type
StatusCodeHelper.validateSchema(response, {
  dkyclink: 'string'
});
// Pass: Field exists and type matches!
```

---

## 🚀 Usage in Your Tests

### In tests/01-customer/02-addcustomer.spec.js

```javascript
import { test, expect } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import APIHelper from '../../helpers/apiHelper.js';
import StatusCodeHelper from '../../helpers/statusCodeHelper.js';

test('add customer', async ({ request }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });

  const responseBody = await response.json();
  
  // Check status
  APIHelper.checkStatus(response, 200);
  
  // 🆕 NEW: Add schema validation!
  StatusCodeHelper.validateSchema(responseBody, {
    dkyclink: 'string',
    customerid: 'number',
    status: 'string'
  }, 'Add Customer Response');
  
  // Log response
  APIHelper.log(responseBody);
});
```

---

## 📝 Summary

| Method | Use Case | Difficulty |
|--------|----------|-----------|
| `validateSchema()` | Full schema with types | Easy ⭐ |
| `validateRequiredFields()` | Just check fields exist | Very Easy ⭐ |
| `validateFieldType()` | Single field type | Easy ⭐ |
| `runSchemaValidationTests()` | Full test suite | Medium ⭐⭐ |
| `runAllTests()` with schema | Everything + schema | Medium ⭐⭐ |

---

**That's it! Simple and powerful schema validation in 3 lines of code! 🎉**

