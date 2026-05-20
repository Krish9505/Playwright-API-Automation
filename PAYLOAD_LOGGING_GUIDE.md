# How to View Payload Details in Test Reports

## 📊 Test Report with Detailed Payload Logging

Your tests now include comprehensive logging that shows **EXACTLY** which payload was sent for each test scenario.

## Where to View Payload Details

### Option 1: View HTML Report (Recommended)
After running tests, open the generated HTML report:
```bash
npx playwright show-report
```

This opens an interactive report showing:
- ✅ All passed tests
- ❌ All failed tests  
- 🔍 Full console logs for each test including payloads

### Option 2: View in Terminal Output
When you run tests, look for sections like:

```
========================================================================
🎯 TEST: Missing Required Field - "customerid"
========================================================================

📋 Scenario: Field "customerid" is REMOVED from payload
Expected Result: 400 Bad Request - API should reject due to missing required field

🚫 Testing MISSING FIELD: "customerid"
Removed field from payload

Payload sent (without customerid):
{
  "mobile": "1234567890",
  "account_code": "CIM-CFA",
  ...
}
Expected: Status >= 400 (Bad Request)
Received: Status 400
Result: ✅ PASS
```

### Option 3: View Test Details with Debug
Run tests with debug mode to see even more details:
```bash
npx playwright test 01-addcustomer-statuscode-CLEAN.spec.js --debug
```

## What Payload Information You'll See

### 1️⃣ **Success Test (200 OK)**
Shows the VALID/COMPLETE payload that was accepted:
```
🎯 TEST: Valid Request with Valid Headers
📋 Scenario: Sending VALID/COMPLETE payload

Payload being sent:
{
  "customerid": "L1911922908652",
  "account_code": "CIM-CFA",
  "mobile": "1234567890",
  ...
}
✅ Response Status: 200
✅ Response Body: { "dkyclink": "..." }
```

### 2️⃣ **Missing Field Test (400 Error)**
Shows WHICH field was removed and the resulting payload:
```
🎯 TEST: Missing Required Field - "mobile"

Payload sent (without mobile):
{
  "customerid": "L1911922908652",
  "account_code": "CIM-CFA",
  ...  ← "mobile" is MISSING
}
Expected: Status >= 400
Received: Status 400
Result: ✅ PASS
```

### 3️⃣ **Invalid Value Test (422 Error)**
Shows the ORIGINAL vs INVALID value:
```
🎯 TEST: Invalid mobile Format

Original value: "1234567890"
Test value: "invalid-mobile"

Payload sent (with modified mobile):
{
  "customerid": "L1911922908652",
  "mobile": "invalid-mobile",  ← INVALID VALUE
  "account_code": "CIM-CFA",
  ...
}
Response status: 400
```

### 4️⃣ **Invalid Headers Test (401 Error)**
Shows WHICH headers were modified:
```
🎯 TEST: Invalid API Key

Header modifications:
  ✏️ SET: "apikey" = "FAKE_INVALID_API_KEY_12345"

Headers sent:
{
  "apikey": "FAKE_INVALID_API_KEY_12345",  ← INVALID
  "Content-Type": "application/json",
  ...
}

Payload sent:
{
  "customerid": "L1911922908652",
  ...
}
Response status: 401
```

### 5️⃣ **Response Structure Validation**
Shows the response fields that were verified:
```
✅ Validating SUCCESS Response Structure
Required fields: dkyclink
Response body:
{
  "dkyclink": "https://...",
  ✅ dkyclink: Present
}
```

## Running Tests for Different Scenarios

### Run All Tests with Detailed Output
```bash
npx playwright test 01-addcustomer-statuscode-CLEAN.spec.js
```

### Run Only Failed Tests
```bash
npx playwright test 01-addcustomer-statuscode-CLEAN.spec.js --last-failed
```

### Run Specific Test Scenarios
```bash
# Only 400 errors (missing fields)
npx playwright test --grep "400 - Bad Request"

# Only 401 errors (authentication)
npx playwright test --grep "401 - Unauthorized"

# Only invalid payload tests
npx playwright test --grep "Invalid"
```

### Run With Full Verbosity
```bash
npx playwright test 01-addcustomer-statuscode-CLEAN.spec.js --reporter=list
```

## 📋 Example: Reading the Output for Failed Test

When a test fails, the report shows:

```
❌ VCI Details - Status Code Validation › 200 - OK (Success) › 200 - Valid Request with Valid Headers

Payload sent:
{
  "vcipref": "abc123xyz"
}

Expected Status: 200
Received Status: 500
Error: Server Internal Error

💡 This shows:
   1. EXACT payload that caused the failure
   2. What status was expected vs received
   3. Why the test failed
```

## 🎯 Key Test Scenarios & What Payloads They Test

| Scenario | What's Tested | Payload Change |
|----------|---------------|-----------------|
| **200 OK** | Valid request | ✅ Full, valid payload sent |
| **400 Bad Request** | Missing required fields | ❌ Required field DELETED |
| **400 Bad Request** | Invalid field values | ⚠️ Field value CHANGED to invalid |
| **401 Unauthorized** | Invalid authentication | 🔐 Header "apikey" set to FAKE value |
| **403 Forbidden** | No permissions | 🔐 Valid auth but no access |
| **404 Not Found** | Wrong endpoint | ❌ Endpoint name WRONG |
| **415 Unsupported Media** | Wrong content-type | 🔐 Header "Content-Type" changed |
| **422 Validation Error** | Invalid data format | ⚠️ Field format INVALID |
| **429 Rate Limit** | Too many requests | ⚡ 10 rapid requests sent |

## 💾 Saving Test Reports

HTML reports are automatically saved to:
```
playwright-report/
```

To view the latest report:
```bash
npx playwright show-report
```

## ✨ Summary

Your tests now have **complete visibility** into:
- ✅ Which payload was sent
- ✅ What changed for error scenarios
- ✅ What status was expected vs received
- ✅ Full response body
- ✅ Field validation results

This makes debugging **much easier** because you can see exactly what data caused success or failure!
