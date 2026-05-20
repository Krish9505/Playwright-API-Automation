# DKYC API AUTOMATION - QUICK REFERENCE & INTERVIEW CHEAT SHEET

## 📊 PROJECT AT A GLANCE

```
Project Type:        API Automation Testing
Framework:          Playwright (JavaScript)
Total Test Files:   13
Test Modules:       5 (Customer, OCR, Facial, Address, Document)
Test Lines:         ~2000+
Reusable Helpers:   4 (apiHelper, statusCodeHelper, imageHelper, testScenariosHelper)
Base URL:           https://sws-portal.syntizen.com/cfa/api/dkyc/
```

---

## 🏗️ ARCHITECTURE LAYERS (Visual)

```
┌─────────────────────────────────────────────────────┐
│                   TEST LAYER                         │
│  tests/01-customer/02-addcustomer.spec.js          │
│  tests/02-ocr/05-ocrfront.spec.js                  │
│  (13 test files organized by feature)               │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              HELPER/UTILITY LAYER                    │
│  APIHelper.checkStatus()     (validation)           │
│  APIHelper.getValue()        (data extraction)      │
│  testScenariosHelper.runAllTests()  (reusable)      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               SERVICE LAYER                         │
│  DocService - Business logic abstraction            │
│  Reusable API call implementations                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│            CONFIG/DATA LAYER                        │
│  config/headers.js       (HTTP headers)             │
│  testdata/apidata.js     (Test data)                │
│  config/authkeyheaders.json  (Auth)                 │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│          PLAYWRIGHT REQUEST CONTEXT                 │
│  Base URL, Headers, Timeouts, Retries               │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 TEST EXECUTION FLOW

```
START
  ▼
[Load Configuration] → headers.js, authkeyheaders.json
  ▼
[Load Test Data] → testdata/apidata.js, docdata.js, etc.
  ▼
[Initialize Request] → Playwright request context
  ▼
[Call Service/Helper] → DocService or APIHelper methods
  ▼
[Make HTTP Request] → POST/GET to API endpoint
  ▼
[Parse Response] → JSON parsing
  ▼
[Validate Response] → Status code, schema, fields
  ▼
[Save Data] → vcipref.json (for dependent tests)
  ▼
[Log Results] → Console + HTML report
  ▼
[Assert Expectations] → expect() statements
  ▼
END

Example Flow for Customer Module:
┌─────────────────────┐
│  01-authkey.spec.js │ ← Validate auth headers
└──────────┬──────────┘
           ▼
┌─────────────────────────────┐
│  02-addcustomer.spec.js     │ ← Create customer, extract dkyclink
└──────────┬──────────────────┘
           │ Save to vcipref.json
           ▼
┌─────────────────────────────┐
│  03-vcipdetails.spec.js     │ ← Use dkyclink from previous test
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│  04-createslot.spec.js      │ ← Create slot with vcip details
└─────────────────────────────┘
```

---

## 📋 CURRENT FILE COUNT & ORGANIZATION

```
Files by Category:
┌──────────────────┬────────────────────────────────┐
│ Folder           │ Count  │ Purpose                │
├──────────────────┼────────┼────────────────────────┤
│ tests/           │ 13     │ Test specifications    │
│ helpers/         │ 4      │ Reusable utilities     │
│ config/          │ 2      │ Configuration files    │
│ services/        │ 1      │ Business logic         │
│ testdata/        │ 7      │ Test data              │
│ images/          │ ?      │ Test images            │
└──────────────────┴────────┴────────────────────────┘

Documentation Files: 4
├── README.md (Main guide)
├── PAYLOAD_LOGGING_GUIDE.md (Payload logging)
├── PAYLOAD_VISIBILITY_SUMMARY.md (Response visibility)
├── TEST_SCENARIOS_GUIDE.md (Test helper guide)
└── SERVICE_LAYER.md (Service abstraction)
```

---

## 🎯 HOW TO EXPLAIN IN 60-90 SECONDS (Interview)

### **The Elevator Pitch:**
"This is a **modular API automation framework** built with **Playwright** that tests the **DKYC (Digital Know Your Customer) API**. It has **13 test files** organized into **5 business modules** - Customer, OCR, Facial Verification, Address, and Document. The architecture follows **layered design** with **configuration**, **service**, **helper**, and **test** layers, allowing **high code reusability** and **easy maintenance**."

### **The Deep Dive (60 seconds):**

1. **Why this architecture?** (15 sec)
   - Separation of concerns for maintainability
   - Reusable helpers reduce code duplication
   - Service layer abstracts business logic
   - Test data isolated from test logic

2. **Key Components** (20 sec)
   - **Config Layer:** Centralized headers, auth, endpoints
   - **Service Layer:** DocService for business logic
   - **Helper Layer:** APIHelper for common operations
   - **Test Layer:** 13 files with specific scenarios

3. **Test Organization** (15 sec)
   - Grouped by business modules (01-customer, 02-ocr, etc.)
   - Numbered sequence indicates execution order
   - Each file tests specific API endpoint
   - Data flows through dependent tests

4. **Strong Points** (10 sec)
   - High code reusability (DRY principle)
   - Easy to add new tests
   - Clear separation of concerns
   - Good documentation

---

## 🔗 INTEGRATION FLOW (How APIs Connect)

```
CUSTOMER FLOW:
addcustomer → Get dkyclink → Save to vcipref.json
     ↓
vcipdetails → Use dkyclink from JSON file
     ↓
createslot → Use customer data from previous tests

OCR FLOW:
ocrfront (Capture front) 
     ↓
savecimocrfront (Save front data)
     ↓
ocrback (Capture back)
     ↓
savecimocrback (Save back data)

VERIFICATION FLOWS:
imageliveness (Verify liveness) + videoupload (Upload video)
     ↓
utilityocr (Extract address) + saveutilityocr (Save address)
     ↓
doc (Verify document)

All flows together = Complete KYC Journey
```

---

## 💻 REAL CODE EXAMPLES FOR INTERVIEW

### **Example 1: Simple Test Structure**
```javascript
import { test, expect } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import APIHelper from '../../helpers/apiHelper.js';

test('add customer', async ({ request }) => {
  // 1. Make request
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });

  // 2. Validate status
  APIHelper.checkStatus(response, 200);
  
  // 3. Parse response
  const responseBody = await response.json();
  
  // 4. Extract data
  const dkyclink = APIHelper.getValue(responseBody, 'dkyclink');
  
  // 5. Save for dependent tests
  fs.writeFileSync('testdata/vcipref.json', JSON.stringify({ dkyclink }));
});
```

### **Example 2: Service Layer Usage**
```javascript
// Service abstraction
export class DocService {
  constructor(request) {
    this.request = request;
  }

  async docdata(doc) {
    const response = await this.request.post('GetDocumentTypes', {
      headers: headers,
      data: doc
    });
    return await response.json();
  }
}

// Usage in test
const docService = new DocService(request);
const docTypes = await docService.docdata(docData);
```

### **Example 3: Helper Functions**
```javascript
// Helper for common operations
static checkStatus(response, expectedStatus = 200) {
  expect(response.status()).toBe(expectedStatus);
}

static getValue(responseBody, key) {
  return responseBody[key];
}

static validateFields(responseBody, requiredFields = []) {
  requiredFields.forEach((field) => {
    expect(field in responseBody).toBe(true);
  });
}

// Usage
APIHelper.checkStatus(response, 200);
const id = APIHelper.getValue(response, 'id');
APIHelper.validateFields(response, ['id', 'name', 'email']);
```

---

## 📊 TEST METRICS AT A GLANCE

```
Total Test Files:     13 files
Test Modules:         5 modules
├── Customer:         4 files
├── OCR:             4 files
├── Facial:          2 files
├── Address:         2 files
└── Document:        1 file

Lines of Code:        ~2000+ lines
Helpers:             4 utility classes
Services:            1 service class
Test Data Files:     7 JSON files
Configuration:       2 config files
Documentation:       4 guide files
```

---

## 🚀 STRENGTHS TO HIGHLIGHT IN INTERVIEW

| Strength | Why It Matters | Example |
|----------|---|---|
| **Modular Architecture** | Easy to maintain and extend | Helpers are reusable across tests |
| **Separation of Concerns** | Clear responsibility | Config ≠ Logic ≠ Tests |
| **Test Data Isolation** | Easy to manage test data | All data in testdata/ folder |
| **Code Reusability** | Less duplication | APIHelper used in 13 tests |
| **Service Layer** | Business logic abstraction | DocService handles API calls |
| **Good Documentation** | Easy onboarding | 4 guide documents included |
| **Feature-Based Org** | Easy to find tests | Tests grouped by module |
| **Numbered Tests** | Clear execution order | 01-authkey → 02-addcustomer |

---

## ⚠️ AREAS TO IMPROVE (For Discussion)

| Issue | Impact | Fix |
|-------|--------|-----|
| **No .env management** | Security risk | Use dotenv package |
| **Hardcoded URLs** | Hard to switch envs | Move to env variables |
| **No global hooks** | Hard to setup/teardown | Add globalSetup.js |
| **No error handling** | Generic error messages | Create custom exceptions |
| **No CI/CD pipeline** | Manual test runs | Add GitHub Actions |
| **No logger** | Hard to debug | Implement centralized logger |

---

## 🎓 INTERVIEW QUESTIONS YOU'LL GET & ANSWERS

### **Q1: Why use Playwright instead of Selenium?**
**A:** "Playwright is faster (built for modern web), has single API for multiple browsers, better network handling, and built-in features like tracing and video recording. It's also easier for API testing."

### **Q2: Explain your test architecture.**
**A:** "We use 4-layer architecture: Config (headers, auth) → Service (business logic) → Helper (utilities) → Test (assertions). This ensures code reuse and maintainability."

### **Q3: How do you manage test data?**
**A:** "All test data is in testdata/ folder as JSON files, separated from test logic. For dependent tests, we extract response data and save it to JSON for next test to use."

### **Q4: How would you add a new test?**
**A:** "1) Add test file in appropriate tests/ subfolder 2) Create test data in testdata/ 3) Use existing helpers/services 4) Write assertions. No need to refactor existing code."

### **Q5: What's your testing strategy?**
**A:** "We follow happy path testing + error scenario validation + status code checks + response schema validation. Data flows through dependent tests (addcustomer → vcipdetails → createslot)."

### **Q6: How do you handle authentication?**
**A:** "Auth key is in config/authkeyheaders.json and passed via headers to every request. For dependent tests, we extract response data and save to JSON."

### **Q7: What improvements would you make?**
**A:** "1) Move to .env for secrets 2) Add error handling with custom exceptions 3) Add CI/CD pipeline 4) Add global setup/teardown hooks 5) Implement centralized logger"

---

## 🔑 KEY TERMS FOR INTERVIEW

- **Modular Architecture** - Code organized in independent layers
- **DRY (Don't Repeat Yourself)** - Reuse code, don't duplicate
- **Separation of Concerns** - Each layer has single responsibility
- **Service Layer** - Abstract business logic from tests
- **Helper Functions** - Common utilities for all tests
- **Test Data Isolation** - Keep data separate from test code
- **Layered Design** - Config → Service → Helper → Test
- **Reusable Fixtures** - Pre-built test data for multiple tests
- **End-to-End Flow** - Test multiple APIs in sequence
- **Data-Driven Testing** - Use external data in tests

---

## 📝 TALKING POINTS CHECKLIST

Use this during interview to remember key points:

- [ ] Mention modular 4-layer architecture
- [ ] Explain separation of concerns
- [ ] Show how helpers reduce duplication
- [ ] Discuss test organization by modules
- [ ] Explain data flow between tests
- [ ] Highlight good documentation
- [ ] Mention code reusability
- [ ] Discuss areas for improvement
- [ ] Show understanding of Playwright
- [ ] Demonstrate knowledge of API testing best practices

---

## 🎯 FINAL TIPS FOR INTERVIEW

1. **Be Ready to Show Code** - Have the project open
2. **Explain File Structure First** - Walk through folders
3. **Use Concrete Examples** - Point to actual test files
4. **Discuss Design Decisions** - Why this architecture?
5. **Acknowledge Improvements** - Show growth mindset
6. **Highlight Strengths** - Modular, maintainable, scalable
7. **Ask Questions** - Show curiosity about improvements
8. **Be Honest** - If you don't know, say so

---

**Good Luck! 🚀 You've got this!**

