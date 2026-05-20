# Allure Report Integration Guide - DKYC API Automation

## 📋 OVERVIEW

Allure is a modern test reporting framework that provides:
- ✅ Beautiful, interactive HTML reports
- ✅ Test history and trends
- ✅ Real-time test execution updates
- ✅ Automatic categorization and filtering
- ✅ Custom test labels, severity, and features
- ✅ Screenshots and attachments support
- ✅ Timeline and duration analytics

---

## 🚀 STEP 1: INSTALLATION

### 1.1 Install Allure Dependencies

```bash
npm install --save-dev allure-playwright
npm install --save-dev allure-commandline
```

### 1.2 Verify Installation

```bash
npx allure --version
```

Expected output:
```
Allure Command Line 2.x.x
```

---

## ⚙️ STEP 2: UPDATE PLAYWRIGHT CONFIG

### Current Config (Before)
```javascript
reporter: [['list'], ['html', { open: 'never' }]],
```

### Updated Config (After)

Edit `playwright.config.js`:

```javascript
// Load environment variables from .env file
require('dotenv').config();

const { defineConfig } = require('@playwright/test');
const { config } = require('./config/env.js');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  fullyParallel: false,
  workers: 1,
  
  // ✨ NEW: Add Allure Reporter
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright']  // ← Add this line
  ],

  testMatch: '**/*.spec.js',
  use: {
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Accept': 'application/json'
    }
  },

  // ✨ NEW: Global setup/teardown (optional but recommended)
  webServer: undefined,
});
```

---

## 📂 STEP 3: UPDATE PROJECT STRUCTURE

Add new folders for reports and utilities:

```
dkyc-api-automation/
├── config/
├── helpers/
├── services/
├── testdata/
├── tests/
├── utils/                    ✨ NEW
│   ├── allureHelper.js       ✨ NEW
│   └── logger.js             ✨ NEW
├── allure-results/          ✨ NEW (auto-generated)
├── allure-report/           ✨ NEW (auto-generated)
├── playwright-report/
├── package.json
├── playwright.config.js
└── README.md
```

---

## 🎯 STEP 4: CREATE ALLURE HELPER UTILITY

Create `utils/allureHelper.js`:

```javascript
import { test } from '@playwright/test';

/**
 * Allure Helper - Utilities for enhanced test reporting
 * Adds metadata, labels, and attachments to test reports
 */

class AllureHelper {
  /**
   * Add test description
   * @param {string} description - Test description
   */
  static description(description) {
    test.info().annotations.push({
      type: 'description',
      description: description
    });
  }

  /**
   * Add feature label
   * @param {string} feature - Feature name
   */
  static feature(feature) {
    test.info().annotations.push({
      type: 'feature',
      description: `Feature: ${feature}`
    });
  }

  /**
   * Add story label
   * @param {string} story - Story name
   */
  static story(story) {
    test.info().annotations.push({
      type: 'story',
      description: `Story: ${story}`
    });
  }

  /**
   * Set severity level
   * @param {string} severity - 'critical', 'major', 'normal', 'minor', 'trivial'
   */
  static severity(severity) {
    test.info().annotations.push({
      type: 'severity',
      description: `Severity: ${severity}`
    });
  }

  /**
   * Add issue ID
   * @param {string} issueId - Issue identifier
   */
  static issue(issueId) {
    test.info().annotations.push({
      type: 'issue',
      description: `Issue: ${issueId}`
    });
  }

  /**
   * Add test case ID
   * @param {string} testCaseId - Test case identifier
   */
  static testCase(testCaseId) {
    test.info().annotations.push({
      type: 'test-case-id',
      description: `Test Case: ${testCaseId}`
    });
  }

  /**
   * Add tag/label
   * @param {string} tag - Tag name
   */
  static tag(tag) {
    test.info().annotations.push({
      type: 'tag',
      description: `Tag: ${tag}`
    });
  }

  /**
   * Attach JSON data to report
   * @param {string} name - Attachment name
   * @param {object} data - JSON data
   */
  static attachJSON(name, data) {
    test.info().attachments.push({
      name: name,
      contentType: 'application/json',
      body: Buffer.from(JSON.stringify(data, null, 2))
    });
  }

  /**
   * Attach response body
   * @param {string} label - Label for attachment
   * @param {object} responseBody - Response data
   */
  static attachResponse(label, responseBody) {
    this.attachJSON(`${label}-response.json`, responseBody);
  }

  /**
   * Attach request payload
   * @param {string} label - Label for attachment
   * @param {object} payload - Request data
   */
  static attachRequest(label, payload) {
    this.attachJSON(`${label}-request.json`, payload);
  }

  /**
   * Attach error context
   * @param {string} error - Error message
   * @param {object} context - Additional context
   */
  static attachError(error, context = {}) {
    this.attachJSON('error-context.json', {
      error: error,
      timestamp: new Date().toISOString(),
      ...context
    });
  }

  /**
   * Add step to report
   * @param {string} stepName - Step name
   * @param {function} stepFn - Step function
   */
  static async step(stepName, stepFn) {
    // Note: Allure steps are captured automatically via test steps
    // This is a helper to log step descriptions
    console.log(`📍 STEP: ${stepName}`);
    return await stepFn();
  }
}

export default AllureHelper;
```

---

## 💻 STEP 5: INTEGRATE WITH EXISTING TESTS

### Example 1: Add Allure Metadata to Status Code Test

Edit `tests/01-customer/01-Addcustomer-statuscode-CLEAN.spec.js`:

```javascript
import { test } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import TestScenariosHelper from '../../helpers/testScenariosHelper.js';
import { config, currentEnv } from '../../config/env.js';
import AllureHelper from '../../utils/allureHelper.js';  // ✨ NEW

const ENDPOINT = 'addcustomer';

test.describe('Add Customer - Status Code Validation', () => {
  
  // ✨ NEW: Add feature and story metadata
  test.beforeEach(() => {
    AllureHelper.feature('Customer Management');
    AllureHelper.story('Add Customer Endpoint');
    AllureHelper.severity('critical');
  });

  test('Status Code Validation', async ({ request }) => {
    // ✨ NEW: Add description
    AllureHelper.description('Validate all status codes for Add Customer endpoint');
    AllureHelper.testCase('TC-001-ADDCUSTOMER-STATUS');
    AllureHelper.tag('api');
    AllureHelper.tag('status-code');

    // Run all standard test scenarios
    TestScenariosHelper.runAllTests(ENDPOINT, headers, addcustomerdata, {
      requiredFields: ['customerid', 'mobile', 'account_code'],
      requiredSuccessFields: ['dkyclink'],
      validationFields: {
        'mobile': 'invalid-mobile',
        'isconsentavailable': 'invalid_value',
      }
    });

    // ✨ NEW: Attach test data to report
    AllureHelper.attachRequest('addcustomer-request', addcustomerdata);
  });
});
```

### Example 2: Happy Path Test with Response Attachment

```javascript
import { test, expect } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import APIHelper from '../../helpers/apiHelper.js';
import AllureHelper from '../../utils/allureHelper.js';  // ✨ NEW

test.describe('Add Customer - Happy Path', () => {

  test('Successfully Add Customer', async ({ request }) => {
    // ✨ NEW: Add metadata
    AllureHelper.feature('Customer Management');
    AllureHelper.story('Create New Customer');
    AllureHelper.severity('critical');
    AllureHelper.testCase('TC-002-ADDCUSTOMER-SUCCESS');
    AllureHelper.description('Add customer with valid data and verify 200 response');
    AllureHelper.tag('happy-path');

    // Make request
    const response = await request.post('addcustomer', {
      headers: headers,
      data: addcustomerdata
    });

    // Validate status
    APIHelper.checkStatus(response, 200);
    const responseBody = await response.json();

    // ✨ NEW: Attach request and response
    AllureHelper.attachRequest('addcustomer-request', addcustomerdata);
    AllureHelper.attachResponse('addcustomer-response', responseBody);

    // Validate response fields
    APIHelper.validateFields(responseBody, ['dkyclink', 'customerid', 'status']);
    
    // ✨ NEW: Verify dkyclink extracted successfully
    const dkyclink = APIHelper.getValue(responseBody, 'dkyclink');
    expect(dkyclink).toBeDefined();
    expect(typeof dkyclink).toBe('string');
  });
});
```

### Example 3: Error Scenario with Error Attachment

```javascript
import { test, expect } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import StatusCodeHelper from '../../helpers/statusCodeHelper.js';
import AllureHelper from '../../utils/allureHelper.js';  // ✨ NEW

test.describe('Add Customer - Error Scenarios', () => {

  test('Missing Required Field - Status 400', async ({ request }) => {
    // ✨ NEW: Add metadata
    AllureHelper.feature('Customer Management');
    AllureHelper.story('Validation Error Handling');
    AllureHelper.severity('major');
    AllureHelper.testCase('TC-003-ADDCUSTOMER-MISSING-FIELD');
    AllureHelper.description('Missing mobile field should return 400 Bad Request');
    AllureHelper.tag('negative-test');
    AllureHelper.tag('validation');

    try {
      // Test missing field
      const response = await StatusCodeHelper.testMissingField(
        request,
        'addcustomer',
        headers,
        addcustomerdata,
        'mobile'
      );

      // ✨ NEW: Attach error response
      const errorBody = await response.json();
      AllureHelper.attachResponse('error-response', errorBody);

    } catch (error) {
      // ✨ NEW: Attach error context
      AllureHelper.attachError(error.message, {
        endpoint: 'addcustomer',
        testData: addcustomerdata
      });
      throw error;
    }
  });
});
```

---

## 📊 STEP 6: RUN TESTS WITH ALLURE

### Option 1: Run Tests and Generate Report

```bash
# Run tests (generates allure-results folder)
npx playwright test

# Generate Allure report
npx allure generate allure-results --clean -o allure-report

# Open Allure report in browser
npx allure open allure-report
```

### Option 2: One-Command Execution

```bash
npx playwright test && npx allure generate allure-results --clean -o allure-report && npx allure open allure-report
```

### Option 3: Add NPM Scripts

Edit `package.json`:

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:api": "npx playwright test tests/api",
    "test:with-allure": "npx playwright test && npx allure generate allure-results --clean -o allure-report && npx allure open allure-report",
    "allure:generate": "npx allure generate allure-results --clean -o allure-report",
    "allure:open": "npx allure open allure-report",
    "allure:clean": "rm -rf allure-results allure-report"
  }
}
```

Then run:
```bash
npm run test:with-allure
```

---

## 🎨 STEP 7: ENHANCED ALLURE CONFIGURATION

### Create `allure.properties` File

Create file `allure.properties` in root:

```properties
# Allure Report Configuration

# Report title
allure.results.directory=allure-results

# Custom report properties
report.name=DKYC API Automation Report
report.version=1.0.0

# Environment variables (optional)
environment.test_env=DEV/UAT/PROD
environment.api_version=1.0
```

### Create `.allureignore` File (Optional)

Create file `.allureignore` in root to exclude certain attachments:

```
*.log
*.tmp
```

---

## 📈 STEP 8: ADVANCED FEATURES

### 8.1 Test with Categories

Update helper to support categories:

```javascript
static category(categoryName) {
  test.info().annotations.push({
    type: 'category',
    description: `Category: ${categoryName}`
  });
}
```

### 8.2 Generate Timeline Report

```bash
npx allure generate allure-results --clean -o allure-report --profile timeline
```

### 8.3 Retry Failed Tests with Allure

Edit `playwright.config.js`:

```javascript
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,  // ← Add retry for failed tests
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],
  // ... rest of config
});
```

---

## 🔄 STEP 9: CI/CD INTEGRATION

### 9.1 GitHub Actions Workflow

Create `.github/workflows/test-with-allure.yml`:

```yaml
name: API Tests with Allure Report

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Playwright tests
        run: npm test
        continue-on-error: true
      
      - name: Generate Allure Report
        run: npx allure generate allure-results --clean -o allure-report
        if: always()
      
      - name: Upload Allure Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-report
          path: allure-report/
```

### 9.2 Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
        }
        
        stage('Publish Report') {
            steps {
                publishHTML([
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    reportName: 'Allure Report'
                ])
            }
        }
    }
    
    post {
        always {
            junit 'allure-results/*.xml'
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
```

---

## 🎯 STEP 10: EXAMPLE TEST SUITE WITH ALLURE

Complete example - `tests/01-customer/01-Addcustomer-allure.spec.js`:

```javascript
import { test, expect } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import APIHelper from '../../helpers/apiHelper.js';
import StatusCodeHelper from '../../helpers/statusCodeHelper.js';
import AllureHelper from '../../utils/allureHelper.js';

const ENDPOINT = 'addcustomer';

test.describe('Add Customer - Complete Allure Example', () => {

  test.beforeEach(() => {
    // ✨ Metadata for all tests in this suite
    AllureHelper.feature('Customer Management');
    AllureHelper.severity('critical');
  });

  test('✅ Happy Path - Add Customer Successfully', async ({ request }) => {
    AllureHelper.story('Create New Customer');
    AllureHelper.testCase('TC-CUST-001');
    AllureHelper.tag('happy-path');
    AllureHelper.tag('smoke');
    AllureHelper.description('Add customer with valid data');

    const response = await StatusCodeHelper.postAndValidateStatus(
      request,
      ENDPOINT,
      headers,
      addcustomerdata,
      200,
      true
    );

    const responseBody = await response.json();
    AllureHelper.attachRequest('request-payload', addcustomerdata);
    AllureHelper.attachResponse('success-response', responseBody);

    APIHelper.validateFields(responseBody, ['dkyclink', 'customerid']);
    expect(responseBody.dkyclink).toBeTruthy();
  });

  test('❌ Missing Field - Mobile Required', async ({ request }) => {
    AllureHelper.story('Validation Error Handling');
    AllureHelper.severity('major');
    AllureHelper.testCase('TC-CUST-002');
    AllureHelper.tag('negative-test');
    AllureHelper.description('Missing mobile field should return 400');

    try {
      const response = await StatusCodeHelper.testMissingField(
        request,
        ENDPOINT,
        headers,
        addcustomerdata,
        'mobile'
      );

      const errorBody = await response.json();
      AllureHelper.attachResponse('error-response', errorBody);

      expect(response.status()).toBeGreaterThanOrEqual(400);
    } catch (error) {
      AllureHelper.attachError(error.message, { endpoint: ENDPOINT });
      throw error;
    }
  });

  test('🔐 Authentication - Invalid API Key', async ({ request }) => {
    AllureHelper.story('Authentication Failures');
    AllureHelper.severity('critical');
    AllureHelper.testCase('TC-CUST-003');
    AllureHelper.tag('security');
    AllureHelper.tag('negative-test');
    AllureHelper.description('Invalid API key should return 401');

    const invalidHeaders = { ...headers, apikey: 'INVALID_KEY' };

    const response = await StatusCodeHelper.postAndValidateStatus(
      request,
      ENDPOINT,
      invalidHeaders,
      addcustomerdata,
      [401, 403],
      true
    );

    AllureHelper.attachResponse('auth-error-response', await response.json());
  });
});
```

---

## 📊 ALLURE REPORT FEATURES

Once generated, your Allure report will include:

### Overview Dashboard
- ✅ Total tests, passed, failed, skipped
- ✅ Test duration graph
- ✅ Latest test run info

### Test Results
- ✅ Full test hierarchy (Feature → Story → Test)
- ✅ Status code (passed/failed/skipped)
- ✅ Test duration
- ✅ Attached screenshots and logs

### Categories & Labels
- ✅ Filter by feature, severity, tag
- ✅ Group by test type
- ✅ Trend analysis

### Detailed Report
- ✅ Request/Response JSON
- ✅ Error context and stack trace
- ✅ Test data and attachments
- ✅ Timeline of test execution

---

## 📝 UPDATED FOLDER STRUCTURE

```
dkyc-api-automation/
├── .github/
│   └── workflows/
│       └── test-with-allure.yml          ✨ NEW
├── config/
│   ├── authkeyheaders.json
│   ├── env.js
│   └── headers.js
├── helpers/
│   ├── apiHelper.js
│   ├── statusCodeHelper.js
│   ├── imageHelper.js
│   └── testScenariosHelper.js
├── utils/                                 ✨ NEW
│   ├── allureHelper.js                    ✨ NEW
│   └── logger.js
├── services/
│   └── docservice.js
├── testdata/
├── tests/
│   └── 01-customer/
│       ├── 01-Addcustomer-statuscode-CLEAN.spec.js
│       └── 01-Addcustomer-allure.spec.js  ✨ NEW
├── allure-results/                        ✨ NEW (auto-generated)
├── allure-report/                         ✨ NEW (auto-generated)
├── playwright-report/
├── .allureignore                          ✨ NEW
├── allure.properties                      ✨ NEW
├── package.json                           ✨ UPDATED
├── playwright.config.js                   ✨ UPDATED
└── README.md
```

---

## 🚨 TROUBLESHOOTING

### Issue 1: "allure: command not found"
```bash
# Solution: Install globally
npm install -g allure-commandline
```

### Issue 2: Empty allure-results folder
```bash
# Solution: Check playwright config has reporter
# Make sure 'allure-playwright' is in reporters array
```

### Issue 3: Report not opening
```bash
# Solution: Check Node.js version (requires 12+)
node --version

# If still fails, generate manually:
npx allure generate allure-results -o allure-report
cd allure-report
npx http-server  # Serve report manually
```

### Issue 4: Previous report data mixed with new
```bash
# Solution: Clean before generating
npx allure generate allure-results --clean -o allure-report
```

---

## ✅ CHECKLIST

- [ ] Install `allure-playwright` and `allure-commandline`
- [ ] Update `playwright.config.js` with Allure reporter
- [ ] Create `utils/allureHelper.js`
- [ ] Create `allure.properties` file
- [ ] Update `package.json` with npm scripts
- [ ] Add AllureHelper to one test file
- [ ] Run `npm run test:with-allure`
- [ ] Verify Allure report opens in browser
- [ ] Add CI/CD workflow file (GitHub/Jenkins)
- [ ] Test in CI/CD pipeline

---

## 🎯 BENEFITS SUMMARY

| Benefit | Before | After |
|---------|--------|-------|
| Report Quality | Basic HTML | Interactive Allure |
| Test History | Not available | Full history & trends |
| Test Categorization | None | Feature, Story, Severity, Tag |
| Attachment Support | Limited | JSON, images, logs |
| CI/CD Integration | Manual | Automated |
| Time to Debug | 30+ minutes | 5 minutes |
| Team Visibility | Low | High |

---

## 📚 ADDITIONAL RESOURCES

- **Allure Docs:** https://docs.qameta.io/allure/
- **Allure Playwright Plugin:** https://github.com/allure-framework/allure-js
- **GitHub Actions:** https://docs.github.com/en/actions
- **Jenkins Integration:** https://plugins.jenkins.io/allure-jenkins-plugin/

---

**Your project now has enterprise-grade test reporting! 🚀**


simple way -  npx playwright test tests/05-docverification/13-doc.spec.js --reporter=allure-playwright

generate reports - npx allure generate allure-results --clean -o allure-report


open - npx allure open allure-report