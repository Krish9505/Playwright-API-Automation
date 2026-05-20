# 🏗️ SERVICE LAYER ARCHITECTURE

## 📚 Table of Contents
1. [Overview](#overview)
2. [What is a Service Layer](#what-is-a-service-layer)
3. [Benefits](#benefits)
4. [Architecture Diagram](#architecture-diagram)
5. [File Structure](#file-structure)
6. [DocService Implementation](#docservice-implementation)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Adding New Services](#adding-new-services)

---

## 📖 Overview

The **Service Layer** is a design pattern that separates API business logic from test files. Instead of making API calls directly in tests, we create dedicated service classes that encapsulate all API operations.

**Without Service Layer:**
```javascript
// ❌ BAD - API logic mixed with test logic
test('Add Customer', async ({ request }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: customerData
  });
  const responseBody = await response.json();
  console.log(responseBody);
});
```

**With Service Layer:**
```javascript
// ✅ GOOD - Clean separation of concerns
test('Add Customer', async ({ request }) => {
  const customerService = new CustomerService(request);
  const response = await customerService.addCustomer(customerData);
  expect(response).toHaveProperty('id');
});
```

---

## 🎯 What is a Service Layer?

A **Service Layer** is an intermediate layer between tests and APIs that:

1. **Encapsulates API Logic** - All HTTP calls in one place
2. **Provides Clean Interface** - Tests call simple methods instead of raw requests
3. **Handles Errors** - Centralized error handling and logging
4. **Manages State** - Stores and manages response data
5. **Reuses Code** - Same methods across multiple tests

---

## ✨ Benefits

| Benefit | Explanation |
|---------|-------------|
| **Reusability** | Write once, use in many tests |
| **Maintainability** | Update API calls in one place |
| **Readability** | Tests focus on "what" not "how" |
| **Error Handling** | Consistent error management |
| **Testability** | Easy to mock services |
| **Type Safety** | Consistent data handling |
| **Scalability** | Easy to add new services |
| **Debugging** | Centralized logging |

---

## 🔄 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        TEST FILES                            │
│  (01-authkey.spec.js, 02-addcustomer.spec.js, etc)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ Uses
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ AuthService      │  │ CustomerService  │                │
│  │ • authenticate() │  │ • addCustomer()  │                │
│  │ • validateToken()│  │ • getCustomer()  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ OcrService       │  │ DocService       │                │
│  │ • uploadFront()  │  │ • verifyDoc()    │                │
│  │ • uploadBack()   │  │ • saveDoc()      │                │
│  └──────────────────┘  └──────────────────┘                │
│                       ▲                                      │
│                   Extends                                    │
│                       │                                      │
│              ┌────────────────────┐                          │
│              │   BaseService      │                          │
│              │ • get()            │                          │
│              │ • post()           │                          │
│              │ • patch()          │                          │
│              │ • delete()         │                          │
│              └────────────────────┘                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ Makes HTTP Calls
┌─────────────────────────────────────────────────────────────┐
│              PLAYWRIGHT REQUEST CONTEXT                      │
│     (Handles actual HTTP communication)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    API SERVER                                │
│  https://sws-portal.syntizen.com/cfa/api/dkyc/              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
Dkyc api automation/
├── helpers/
│   └── services/
│       ├── BaseService.js                 (Base class)
│       ├── AuthService.js                 (Authentication)
│       ├── CustomerService.js             (Customer operations)
│       ├── OcrService.js                  (OCR operations)
│       ├── FacialVerificationService.js   (Facial verification)
│       ├── AddressVerificationService.js  (Address verification)
│       ├── DocService.js                  (Document operations) ✨
│       └── ServiceFactory.js              (Service instantiation)
├── config/
│   ├── headers.js                         (HTTP headers)
│   └── environment.js                     (Environment config)
├── testdata/
│   ├── apidata.js
│   ├── docdata.js
│   ├── facialdata.js
│   └── addressdata.js
├── tests/
│   ├── 01-customer/
│   ├── 02-Ocr/
│   ├── 03-facialverification/
│   ├── 04-Adressverification/
│   └── 05-docverification/
│       └── 13-doc.spec.js
└── SERVICE_LAYER.md                       (This file)
```

---

## 🔧 DocService Implementation

### **Class Definition**

```javascript
export class DocService {
  constructor(request, config = {}) {
    this.request = request;
    this.headers = config.headers || headers;
    this.baseURL = config.baseURL || 'https://sws-portal.syntizen.com/cfa/api/dkyc/';
    this.timeout = config.timeout || 30000;
  }
```

### **Available Methods**

#### 1. **getDocumentTypes(docData)**
Fetches all available document types.

```javascript
const docService = new DocService(request);
const response = await docService.getDocumentTypes(docData);
// Returns: { statusCode: 200, documentTypes: [...] }
```

#### 2. **verifyDocument(docData)**
Verifies a document against provided data.

```javascript
const docService = new DocService(request);
const response = await docService.verifyDocument(docData);
// Returns: { statusCode: 200, verified: true, message: "Document verified" }
```

#### 3. **uploadDocument(docData)**
Uploads a document file to the system.

```javascript
const docService = new DocService(request);
const response = await docService.uploadDocument(docData);
// Returns: { statusCode: 200, documentId: "DOC-12345" }
```

#### 4. **getDocumentStatus(documentId)**
Retrieves the current status of a document.

```javascript
const docService = new DocService(request);
const response = await docService.getDocumentStatus('DOC-12345');
// Returns: { statusCode: 200, status: "pending", percentage: 50 }
```

#### 5. **saveDocument(docData)**
Saves document information to the system.

```javascript
const docService = new DocService(request);
const response = await docService.saveDocument(docData);
// Returns: { statusCode: 200, savedDocumentId: "DOC-12346" }
```

---

## 💡 Usage Examples

### **Example 1: Simple Document Verification Test**

```javascript
import { expect, test } from '@playwright/test';
import { DocService } from '../../services/docservice.js';
import { docdata } from '../../testdata/docdata.js';

test('Verify Document Successfully', async ({ request }) => {
  // Initialize service
  const docService = new DocService(request);

  // Call service method
  const response = await docService.verifyDocument(docdata);

  // Assert response
  expect(response).toBeDefined();
  expect(response.statusCode).toBe(200);
  expect(response.verified).toBeTruthy();
  expect(response).toHaveProperty('message');

  console.log('✓ Document verification test passed');
});
```

### **Example 2: Multiple Operations in Sequence**

```javascript
test('Document Workflow', async ({ request }) => {
  const docService = new DocService(request);

  // Step 1: Upload document
  const uploadResponse = await docService.uploadDocument(docData);
  const documentId = uploadResponse.documentId;
  expect(documentId).toBeDefined();

  // Step 2: Get document status
  const statusResponse = await docService.getDocumentStatus(documentId);
  expect(statusResponse.status).toBe('pending');

  // Step 3: Verify document
  const verifyResponse = await docService.verifyDocument({
    documentId: documentId,
    ...otherData
  });
  expect(verifyResponse.verified).toBeTruthy();

  console.log('✓ Complete document workflow passed');
});
```

### **Example 3: Error Handling**

```javascript
test('Handle Document Verification Error', async ({ request }) => {
  const docService = new DocService(request);
  
  const invalidData = {
    documentType: 'invalid_type',
    documentNumber: ''
  };

  try {
    await docService.verifyDocument(invalidData);
    throw new Error('Should have thrown an error');
  } catch (error) {
    expect(error.message).toContain('verification failed');
    console.log('✓ Error handling works correctly');
  }
});
```

### **Example 4: Custom Configuration**

```javascript
test('With Custom Configuration', async ({ request }) => {
  const customConfig = {
    headers: {
      'Authorization': 'Bearer custom-token',
      'Content-Type': 'application/json'
    },
    timeout: 60000  // 60 seconds
  };

  const docService = new DocService(request, customConfig);
  const response = await docService.verifyDocument(docdata);

  expect(response).toBeDefined();
});
```

---

## 📝 Best Practices

### ✅ DO's

```javascript
// ✅ DO: Use service layer methods
const docService = new DocService(request);
const response = await docService.verifyDocument(data);

// ✅ DO: Add proper assertions
expect(response).toHaveProperty('statusCode');
expect(response.statusCode).toBe(200);

// ✅ DO: Handle errors gracefully
try {
  const response = await docService.verifyDocument(data);
} catch (error) {
  console.error('Verification failed:', error.message);
  throw error;
}

// ✅ DO: Use descriptive variable names
const verificationResponse = await docService.verifyDocument(docData);

// ✅ DO: Log important steps
console.log('✓ Document verified successfully');
```

### ❌ DON'Ts

```javascript
// ❌ DON'T: Mix API calls with test logic
const response = await request.post('DocVerification', { ... });
const data = await response.json();

// ❌ DON'T: Ignore error responses
const response = await request.post(...);
const data = await response.json();  // May crash if response is not JSON

// ❌ DON'T: Use generic variable names
const res = await docService.verifyDocument(data);
const obj = await res.json();

// ❌ DON'T: Skip assertions
const response = await docService.verifyDocument(data);
console.log(response);  // No validation!

// ❌ DON'T: Hardcode values
const response = await docService.getDocumentStatus('DOC-HARDCODED-ID');
```

---

## 🔨 Adding New Services

### **Step 1: Create Service Class**

```javascript
// filepath: helpers/services/PaymentService.js
import { BaseService } from './BaseService.js';

export class PaymentService extends BaseService {
  async processPayment(paymentData) {
    try {
      const response = await this.post('ProcessPayment', paymentData);
      
      if (!response.ok()) {
        throw new Error(`Payment processing failed: ${response.status()}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error in processPayment:', error.message);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await this.get(`GetPaymentStatus/${paymentId}`);
      
      if (!response.ok()) {
        throw new Error(`Failed to get payment status: ${response.status()}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error in getPaymentStatus:', error.message);
      throw error;
    }
  }
}
```

### **Step 2: Create Test File**

```javascript
// filepath: tests/06-payment/14-payment.spec.js
import { expect, test } from '@playwright/test';
import { PaymentService } from '../../helpers/services/PaymentService.js';
import { paymentData } from '../../testdata/paymentdata.js';

test('Process Payment', async ({ request }) => {
  const paymentService = new PaymentService(request);
  
  const response = await paymentService.processPayment(paymentData);
  
  expect(response).toHaveProperty('paymentId');
  expect(response.statusCode).toBe(200);
});
```

### **Step 3: Use Service Factory (Optional)**

```javascript
// filepath: helpers/services/ServiceFactory.js
import { DocService } from './DocService.js';
import { PaymentService } from './PaymentService.js';
import { headers } from '../../config/headers.js';

export class ServiceFactory {
  static createServices(request) {
    const config = { headers };
    
    return {
      docService: new DocService(request, config),
      paymentService: new PaymentService(request, config)
    };
  }
}

// Usage in test:
const { docService, paymentService } = ServiceFactory.createServices(request);
```

---

## 🎓 Key Concepts

### **Separation of Concerns**
- Tests focus on **what** to test
- Services handle **how** to call APIs

### **DRY Principle (Don't Repeat Yourself)**
- Write API logic once in service
- Use in multiple tests

### **Error Handling**
- Services handle errors consistently
- Tests don't need try-catch for every call

### **Maintainability**
- API endpoint changes? Update service once
- All tests automatically use new endpoint

### **Testing Strategy**
- Service methods can be tested independently
- Can mock services for unit testing

---

## 🚀 Running Tests

```bash
# Run all document tests
npx playwright test 13-doc

# Run specific test
npx playwright test --grep "Verify Document"

# Run with debug mode
npx playwright test 13-doc --debug

# View test report
npx playwright show-report
```

---

## 📚 Additional Resources

- [Playwright Request API](https://playwright.dev/docs/api/class-apirequestcontext)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Test Best Practices](https://playwright.dev/docs/best-practices)

---

## 💬 Questions?

For more information about specific services:
- **DocService**: Document operations
- **OcrService**: OCR image processing
- **CustomerService**: Customer management
- **AuthService**: Authentication

Check individual service files for detailed method documentation.

---

**Last Updated:** April 30, 2026  
**Version:** 1.0.0
