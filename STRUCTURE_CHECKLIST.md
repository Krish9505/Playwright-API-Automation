# 📋 PROJECT STRUCTURE CHECKLIST & RECOMMENDATIONS

## ✅ CURRENT STRENGTHS

| Item | Status | Notes |
|------|--------|-------|
| Test Organization | ✅ | 5 modules: Customer, OCR, Facial, Address, Document |
| Modular Helpers | ✅ | Reusable functions reduce code duplication |
| Service Layer | ✅ | Business logic abstraction in place |
| Test Data Separation | ✅ | Data files separate from test logic |
| Configuration Centralization | ✅ | Headers and auth keys in config folder |
| Documentation | ✅ | Multiple guide files available |
| Playwright Setup | ✅ | Configured with baseURL and headers |
| Feature-Based Tests | ✅ | Tests grouped by business modules |

---

## ❌ MISSING STRUCTURES (Priority Order)

### 🔴 **CRITICAL (Must Have)**

#### 1. Environment Variables Management
```
Priority: HIGH
Impact: High (Security & Flexibility)
Effort: 1-2 hours

What's Missing:
- .env file for secrets
- env.js is empty
- Hardcoded URLs and keys in config/headers.js

Action Items:
[ ] Create .env.example
[ ] Create .env (git ignored)
[ ] Populate env.js with process.env values
[ ] Update playwright.config.js to use env variables
[ ] Update headers.js to use env variables

Example:
---
.env.example:
BASE_URL=https://sws-portal.syntizen.com/cfa/api/dkyc/
AUTHKEY=your-auth-key-here
APIKEY=your-api-key-here
ENVIRONMENT=dev

env.js:
export const config = {
  baseURL: process.env.BASE_URL,
  authKey: process.env.AUTHKEY,
  apiKey: process.env.APIKEY,
  environment: process.env.ENVIRONMENT || 'dev'
};
---
```

#### 2. Global Hooks & Setup/Teardown
```
Priority: HIGH
Impact: High (Test Reliability)
Effort: 1-2 hours

What's Missing:
- No beforeAll/afterAll hooks
- No beforeEach/afterEach hooks
- No global setup.ts
- No teardown logic

Action Items:
[ ] Create playwright.config.js with globalSetup
[ ] Create tests/hooks/globalSetup.js
[ ] Create tests/hooks/globalTeardown.js
[ ] Add auth token initialization
[ ] Add report cleanup

Example:
---
tests/hooks/globalSetup.js:
export default async function globalSetup(config) {
  console.log('🚀 Starting test suite...');
  // Initialize shared resources
  // Generate auth tokens
  // Setup test database
}

tests/hooks/globalTeardown.js:
export default async function globalTeardown(config) {
  console.log('✅ Tests completed');
  // Cleanup resources
  // Close database connections
  // Archive reports
}

playwright.config.js:
export default defineConfig({
  globalSetup: './tests/hooks/globalSetup.js',
  globalTeardown: './tests/hooks/globalTeardown.js',
  ...
});
---
```

#### 3. Error Handling & Custom Exceptions
```
Priority: HIGH
Impact: Medium (Code Quality)
Effort: 2-3 hours

What's Missing:
- No custom error classes
- No error hierarchy
- Generic error messages

Action Items:
[ ] Create errors/ folder
[ ] Create ApiError.js
[ ] Create ValidationError.js
[ ] Create TimeoutError.js
[ ] Update helpers to throw custom errors

Example:
---
errors/ApiError.js:
export class ApiError extends Error {
  constructor(statusCode, message, response) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

errors/ValidationError.js:
export class ValidationError extends Error {
  constructor(field, expected, actual) {
    super(`Validation failed: ${field}`);
    this.name = 'ValidationError';
    this.field = field;
    this.expected = expected;
    this.actual = actual;
  }
}

helpers/apiHelper.js (usage):
static checkStatus(response, expectedStatus = 200) {
  if (response.status() !== expectedStatus) {
    throw new ApiError(
      response.status(),
      `Expected ${expectedStatus}, got ${response.status()}`,
      await response.json()
    );
  }
}
---
```

---

### 🟡 **HIGH (Strongly Recommended)**

#### 4. CI/CD Pipeline Configuration
```
Priority: HIGH
Impact: High (Automation)
Effort: 2-3 hours

What's Missing:
- No GitHub Actions workflow
- No automated test runs
- No report generation pipeline

Action Items:
[ ] Create .github/workflows/test.yml
[ ] Configure test triggers (push, PR, schedule)
[ ] Add report publishing
[ ] Add Slack notifications (optional)

Example:
---
.github/workflows/test.yml:
name: API Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
---
```

#### 5. Utils/Utilities Folder
```
Priority: HIGH
Impact: Medium (Code Quality & Reusability)
Effort: 1-2 hours

What's Missing:
- No constants file (magic strings everywhere)
- No centralized logger
- No validation helpers
- No retry logic utilities

Action Items:
[ ] Create utils/constants.js
[ ] Create utils/logger.js
[ ] Create utils/validator.js
[ ] Create utils/retryHelper.js

Example:
---
utils/constants.js:
export const API_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000
};

export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const ENDPOINTS = {
  ADD_CUSTOMER: 'addcustomer',
  GET_DOC_TYPES: 'GetDocumentTypes',
  OCR_FRONT: 'ocrfront'
};

utils/logger.js:
export class Logger {
  static info(message) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }
  
  static error(message, error) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }
  
  static success(message) {
    console.log(`[✅] ${new Date().toISOString()} - ${message}`);
  }
}

utils/validator.js:
export class Validator {
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  static isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }
  
  static hasRequiredFields(obj, fields) {
    return fields.every(field => field in obj);
  }
}

utils/retryHelper.js:
export async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
---
```

---

### 🟢 **MEDIUM (Good to Have)**

#### 6. Fixtures for Test Context
```
Priority: MEDIUM
Impact: Medium (Code Reusability)
Effort: 1-2 hours

What's Missing:
- No custom fixtures
- No shared test context
- No auth token management

Action Items:
[ ] Create tests/fixtures/ folder
[ ] Create tests/fixtures/auth.js
[ ] Create tests/fixtures/apiContext.js

Example:
---
tests/fixtures/auth.js:
import { test as base } from '@playwright/test';

export const test = base.extend({
  auth: async ({ }, use) => {
    const token = process.env.AUTHKEY;
    await use(token);
  },
  
  headers: async ({ auth }, use) => {
    const headers = {
      'Content-Type': 'application/json',
      'authkey': auth
    };
    await use(headers);
  }
});

Usage in tests:
test('add customer', async ({ request, headers }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });
});
---
```

#### 7. Report Management & Artifacts
```
Priority: MEDIUM
Impact: Medium (Visibility)
Effort: 2-3 hours

What's Missing:
- No Allure report integration
- No custom HTML reports
- No report automation

Action Items:
[ ] Add @wdio/allure-reporter (optional)
[ ] Create report generation script
[ ] Add report archival strategy
[ ] Create reports/.gitkeep

Example:
---
package.json:
"scripts": {
  "test": "playwright test",
  "test:report": "playwright test && allure generate --clean -o allure-report",
  "test:ci": "playwright test --reporter=json,html"
}

.gitignore:
playwright-report/
test-results/
allure-report/
.allure/
---
```

---

### 🔵 **LOW (Optional/Nice to Have)**

#### 8. Database/Mock Server Integration
```
Priority: LOW
Impact: Low (Specialty Feature)
Effort: 2-4 hours

What's Missing:
- No mock server setup
- No database assertions
- No data persistence layer

Recommendation:
- Add if you need to verify database state after API calls
- Use MSW (Mock Service Worker) for mocking
- Use test database for assertions
```

#### 9. Pre-commit Hooks
```
Priority: LOW
Impact: Low (Code Quality)
Effort: 1 hour

What's Missing:
- No pre-commit hooks
- No linting automation

Action Items:
[ ] Install husky: npm install husky --save-dev
[ ] Install lint-staged: npm install lint-staged --save-dev
[ ] Create .husky/pre-commit

Example:
---
.husky/pre-commit:
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint-staged

package.json:
"lint-staged": {
  "*.js": "eslint --fix"
}
---
```

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### **Week 1 (Critical - Do First)**
- [ ] Set up environment variables (.env, env.js)
- [ ] Create custom error classes
- [ ] Add CI/CD pipeline (.github/workflows)

### **Week 2 (Important - Do Next)**
- [ ] Create utils folder with constants and logger
- [ ] Add global hooks (setup/teardown)
- [ ] Add validation helpers

### **Week 3 (Nice to Have)**
- [ ] Create test fixtures
- [ ] Add retry logic helpers
- [ ] Implement Allure reports
- [ ] Add pre-commit hooks

---

## 📁 COMPLETE ENHANCED FOLDER STRUCTURE

```
dkyc-api-automation/
├── .github/
│   └── workflows/
│       ├── test.yml                    ✨ NEW
│       └── report.yml                  ✨ NEW
│
├── config/
│   ├── .env.example                    ✨ NEW
│   ├── .env                            ✨ NEW (git ignored)
│   ├── authkeyheaders.json
│   ├── env.js                          📝 MODIFY
│   └── headers.js                      📝 MODIFY
│
├── errors/                             ✨ NEW FOLDER
│   ├── ApiError.js
│   ├── ValidationError.js
│   └── TimeoutError.js
│
├── utils/                              ✨ NEW FOLDER
│   ├── constants.js
│   ├── logger.js
│   ├── validator.js
│   └── retryHelper.js
│
├── helpers/
│   ├── apiHelper.js
│   ├── statusCodeHelper.js
│   ├── imageHelper.js
│   └── testScenariosHelper.js
│
├── services/
│   └── docservice.js
│
├── fixtures/                           ✨ NEW FOLDER
│   ├── auth.js
│   └── requestContext.js
│
├── testdata/
│   ├── adressdata.js
│   ├── apidata.js
│   ├── docdata.js
│   ├── facialdata.js
│   ├── ocrdata.js
│   ├── vcipkey.json
│   └── vcipref.json
│
├── tests/
│   ├── hooks/                          ✨ NEW FOLDER
│   │   ├── globalSetup.js
│   │   └── globalTeardown.js
│   │
│   ├── 01-customer/
│   │   ├── 01-Addcustomer-statuscode-CLEAN.spec.js
│   │   ├── 01-authkey.spec.js
│   │   ├── 02-addcustomer.spec.js
│   │   ├── 03-vcipdetails-statuscode.spec.js
│   │   ├── 03-vcipdetails.spec.js
│   │   └── 04-createslot.spec.js
│   │
│   ├── 02-Ocr/
│   │   ├── 05-ocrfront.spec.js
│   │   ├── 06-savecimocrfront.spec.js
│   │   ├── 07-ocrback.spec.js
│   │   └── 08-savecimocrback2.spec.js
│   │
│   ├── 03-facialverification/
│   │   ├── 09-imageliveness.spec.js
│   │   └── 10-videoupload.spec.js
│   │
│   ├── 04-Adressverification/
│   │   ├── 11-utilityocr.spec.js
│   │   └── 12-saveutilityocr.spec.js
│   │
│   └── 05-docverification/
│       └── 13-doc.spec.js
│
├── reports/                            ✨ NEW FOLDER
│   ├── .gitkeep
│   ├── html/
│   ├── json/
│   └── allure/
│
├── .gitignore                          📝 MODIFY
├── .env.example                        ✨ NEW
├── .eslintrc.json                      ✨ NEW (optional)
├── .prettierrc.json                    ✨ NEW (optional)
├── INTERVIEW_GUIDE.md                  ✨ NEW
├── STRUCTURE_CHECKLIST.md              ✨ NEW (this file)
├── PAYLOAD_LOGGING_GUIDE.md
├── PAYLOAD_VISIBILITY_SUMMARY.md
├── TEST_SCENARIOS_GUIDE.md
├── SERVICE_LAYER.md
├── README.md
├── playwright.config.js                📝 MODIFY
└── package.json                        📝 MODIFY
```

---

## 🔧 QUICK SETUP COMMANDS

```bash
# 1. Install dependencies for new features
npm install --save-dev dotenv @wdio/allure-reporter

# 2. Create .env file
cp .env.example .env
# Edit .env with your values

# 3. Create new folders
mkdir -p config/errors utils tests/fixtures tests/hooks reports/{html,json,allure}

# 4. Update .gitignore
echo ".env" >> .gitignore
echo "reports/" >> .gitignore
echo "allure-report/" >> .gitignore
```

---

## ✅ VALIDATION CHECKLIST

Use this to verify your setup:

- [ ] Environment variables in .env (not in repo)
- [ ] All hardcoded URLs moved to env variables
- [ ] Custom error classes created and used
- [ ] Utils folder with constants and helpers
- [ ] Global setup/teardown hooks configured
- [ ] CI/CD pipeline configured
- [ ] Sensitive data not in git history
- [ ] Logger implemented
- [ ] Test fixtures created
- [ ] All tests passing with new structure
- [ ] Reports being generated
- [ ] Documentation updated

---

## 📞 SUMMARY FOR INTERVIEW

**Current State:** ✅ Good modular architecture  
**Missing Critical Parts:** Environment management, error handling, CI/CD  
**Estimated Time to Complete:** 4-6 hours  
**Recommended Priority:** Critical first, then High, then Medium  
**Team Impact:** Improves maintainability and scalability significantly  

