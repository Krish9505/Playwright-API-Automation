# Playwright API Automation - Interview Preparation Guide

**For 5+ Years Experienced Developers**

---

## SECTION 1: FOUNDATIONAL CONCEPT

### 1. Explain the architecture of Playwright and how it differs from Selenium.
- Playwright uses a single unified API for Chromium, Firefox, and WebKit
- Browser automation happens out-of-process via CDP (Chrome DevTools Protocol)
- No dependency on language bindings; uses WebSocket communication
- Built-in support for network interception, tracing, and video recording
- Better performance due to native bindings

### 2. What is the purpose of `playwright.config.js` and key configurations?
```javascript
// Key configurations
testDir: './tests',              // Test file location
testMatch: '**/*.spec.js',       // Test file pattern
timeout: 30 * 1000,              // Test timeout
fullyParallel: true,             // Parallel execution
workers: 4,                       // Number of workers
retries: 1,                       // Retry failed tests
use: {
  baseURL: 'https://api.example.com',
  extraHTTPHeaders: {...},
  trace: 'on-first-retry'        // Trace on failure
}
```

### 3. What are the different ways to authenticate in API automation?
```javascript
// Method 1: Bearer Token
const response = await request.get(endpoint, {
  headers: { 'Authorization': 'Bearer ' + token }
});

// Method 2: Basic Auth
const response = await request.get(endpoint, {
  headers: { 'Authorization': 'Basic ' + btoa(user:pass) }
});

// Method 3: API Key
const response = await request.get(endpoint, {
  headers: { 'X-API-Key': apiKey }
});

// Method 4: OAuth (Using context)
const context = await browser.newContext({
  storageState: 'auth.json'
});
```

---

## SECTION 2: INTERMEDIATE CONCEPTS

### 4. How do you handle dynamic test data and parameterization?
```javascript
import { test } from '@playwright/test';
import testdata from './testdata.json';

for (const data of testdata) {
  test(`API test - ${data.testCase}`, async ({ request }) => {
    const response = await request.post(data.endpoint, {
      data: data.payload
    });
    expect(response.status()).toBe(data.expectedStatus);
  });
}

test.describe.parallel('Customer APIs', () => {
  test('Create customer', async ({ request }) => {});
  test('Update customer', async ({ request }) => {});
});
```

### 5. How do you implement request/response interception and mocking?
```javascript
test('Intercept and mock API responses', async ({ request, page }) => {
  await page.route('**/api/users/**', route => {
    route.abort('blockedbyclient');
  });

  await page.route('**/api/data', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ mocked: true })
    });
  });

  const response = await request.get(url);
});
```

### 6. How do you structure a robust error handling and retry mechanism?
```javascript
test('With retry logic', async ({ request }) => {
  let response;
  let retries = 3;
  
  while (retries > 0) {
    try {
      response = await request.post(endpoint, {
        data: payload,
        timeout: 5000
      });
      
      if (response.ok()) break;
      retries--;
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.log(`Attempt failed: ${error.message}`);
      retries--;
    }
  }
  
  expect(response.ok()).toBeTruthy();
});
```

---

## SECTION 3: ADVANCED CONCEPTS

### 7. How do you implement request chaining and dependency management?
```javascript
test.describe('Request Chaining', () => {
  let customerId: string;
  let orderId: string;

  test('Create customer and use ID in subsequent requests', async ({ request }) => {
    const customerRes = await request.post('/customers', {
      data: { name: 'John', email: 'john@example.com' }
    });
    const customer = await customerRes.json();
    customerId = customer.id;
    expect(customerRes.ok()).toBeTruthy();
  });

  test('Create order using customer ID', async ({ request }) => {
    expect(customerId).toBeDefined();
    
    const orderRes = await request.post('/orders', {
      data: { customerId, amount: 100 }
    });
    const order = await orderRes.json();
    orderId = order.id;
    expect(orderRes.ok()).toBeTruthy();
  });

  test('Verify order belongs to customer', async ({ request }) => {
    expect(orderId).toBeDefined();
    
    const orderRes = await request.get(`/orders/${orderId}`);
    const order = await orderRes.json();
    expect(order.customerId).toBe(customerId);
  });
});
```

### 8. How do you implement comprehensive request/response logging and debugging?
```javascript
test('With detailed logging', async ({ request }) => {
  const startTime = Date.now();
  
  console.log('🔵 Request Details:');
  console.log(`Endpoint: POST /api/users`);
  console.log(`Headers: ${JSON.stringify(headers)}`);
  console.log(`Payload: ${JSON.stringify(payload)}`);

  const response = await request.post('/users', {
    data: payload,
    headers: headers
  });

  const responseBody = await response.json();
  const duration = Date.now() - startTime;

  console.log('🟢 Response Details:');
  console.log(`Status: ${response.status()}`);
  console.log(`Headers: ${JSON.stringify(response.headers())}`);
  console.log(`Body: ${JSON.stringify(responseBody)}`);
  console.log(`Duration: ${duration}ms`);

  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('id');
});
```

### 9. How do you handle asynchronous operations and promises in API tests?
```javascript
test('Parallel async operations', async ({ request }) => {
  const endpoints = ['/users', '/orders', '/products'];
  
  const responses = await Promise.all(
    endpoints.map(ep => request.get(ep))
  );
  responses.forEach(res => expect(res.ok()).toBeTruthy());

  const results = await Promise.allSettled(
    endpoints.map(ep => request.get(ep).then(r => r.json()))
  );
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      expect(result.value).toBeDefined();
    }
  });
});
```

### 10. How do you implement test fixtures for setup/teardown?
```javascript
test.describe('Using Fixtures', () => {
  test.beforeAll(async ({ playwright }) => {
    console.log('Setting up test environment');
  });

  test.beforeEach(async ({ request }) => {
    const setupRes = await request.post('/setup', {
      data: { environment: 'test' }
    });
    expect(setupRes.ok()).toBeTruthy();
  });

  test.afterEach(async ({ request }) => {
    const cleanRes = await request.post('/cleanup');
    expect(cleanRes.ok()).toBeTruthy();
  });

  test('Main test', async ({ request }) => {
    const response = await request.get('/data');
    expect(response.ok()).toBeTruthy();
  });

  test.afterAll(async () => {
    console.log('Cleaning up test environment');
  });
});
```

---

## SECTION 4: EXPERT-LEVEL PATTERNS

### 11. Custom request wrapper with interceptors
```javascript
class APIClient {
  constructor(request, baseURL, headers = {}) {
    this.request = request;
    this.baseURL = baseURL;
    this.headers = { ...headers };
    this.interceptors = {
      request: [],
      response: []
    };
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  async _executeRequestInterceptors(config) {
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }
    return config;
  }

  async _executeResponseInterceptors(response) {
    for (const interceptor of this.interceptors.response) {
      response = await interceptor(response);
    }
    return response;
  }

  async post(endpoint, data) {
    let config = {
      url: `${this.baseURL}${endpoint}`,
      data: data,
      headers: this.headers
    };

    config = await this._executeRequestInterceptors(config);
    let response = await this.request.post(config.url, { ...config });
    response = await this._executeResponseInterceptors(response);

    return response;
  }
}
```

### 12. Comprehensive schema validation
```javascript
import Ajv from 'ajv';

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 0 }
  },
  required: ['id', 'name', 'email']
};

test('Validate response schema', async ({ request }) => {
  const ajv = new Ajv();
  const validate = ajv.compile(userSchema);

  const response = await request.get('/users/1');
  const data = await response.json();

  const isValid = validate(data);
  if (!isValid) {
    console.log('Schema validation errors:', validate.errors);
  }
  expect(isValid).toBeTruthy();
});
```

### 13. Performance testing within API tests
```javascript
test('Performance threshold validation', async ({ request }) => {
  const measurements = {
    TTFB: 500,
    responseTime: 1000,
    totalTime: 2000
  };

  const startTime = performance.now();
  
  const response = await request.post('/heavy-endpoint', {
    data: { operation: 'complex' }
  });

  const duration = performance.now() - startTime;

  console.log(`Response Time: ${duration}ms`);
  expect(duration).toBeLessThan(measurements.responseTime);
  expect(response.ok()).toBeTruthy();
});
```

### 14. Database state assertions in API testing
```javascript
import { connectDB } from '../../helpers/dbHelper';

test('Verify API changes in database', async ({ request }) => {
  const db = await connectDB();

  const apiResponse = await request.post('/users', {
    data: { name: 'Alice', email: 'alice@test.com' }
  });
  
  const createdUser = await apiResponse.json();

  const dbUser = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [createdUser.id]
  );

  expect(dbUser[0].name).toBe('Alice');
  expect(dbUser[0].email).toBe('alice@test.com');

  await db.close();
});
```

### 15. Test reporting and analytics
```javascript
test('With custom reporting', async ({ request }, testInfo) => {
  const response = await request.get('/health');
  
  testInfo.annotations.push({
    type: 'endpoint',
    description: '/health'
  });

  testInfo.annotations.push({
    type: 'response_time',
    description: `${performance.now()}ms`
  });

  expect(response.ok()).toBeTruthy();
});
```

---

## SECTION 5: REAL-WORLD SCENARIOS

### 16. API versioning and backward compatibility
```javascript
test.describe('API Versioning', () => {
  const versions = ['v1', 'v2'];

  versions.forEach(version => {
    test(`Test endpoint with ${version}`, async ({ request }) => {
      const endpoint = `https://api.example.com/${version}/users`;
      const response = await request.get(endpoint);
      
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data).toHaveProperty('id');
    });
  });
});
```

### 17. Multi-environment testing
```javascript
const environments = {
  dev: 'https://dev-api.example.com',
  staging: 'https://staging-api.example.com',
  prod: 'https://api.example.com'
};

test.describe.parallel('Multi-Environment', () => {
  Object.entries(environments).forEach(([env, url]) => {
    test(`Health check on ${env}`, async ({ request }) => {
      const response = await request.get(`${url}/health`);
      expect(response.ok()).toBeTruthy();
    });
  });
});
```

### 18. Contract testing
```javascript
test('Consumer contract verification', async ({ request }) => {
  const response = await request.get('/users/1');
  const user = await response.json();

  expect(user).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    email: expect.any(String)
  });

  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(Array.isArray(user.roles)).toBe(true);
});
```

### 19. Reusable test helper library
```javascript
// helpers/apiHelper.js
export class APIHelper {
  constructor(request, config = {}) {
    this.request = request;
    this.config = config;
  }

  async createResource(endpoint, data) {
    const response = await this.request.post(endpoint, { data });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async updateResource(endpoint, data) {
    const response = await this.request.patch(endpoint, { data });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async deleteResource(endpoint) {
    const response = await this.request.delete(endpoint);
    expect([200, 204]).toContain(response.status());
  }

  async getResource(endpoint) {
    const response = await this.request.get(endpoint);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
}
```

### 20. Complex workflows with state management
```javascript
test.describe('Complex Workflow', () => {
  const testState = {
    customerId: null,
    orderId: null,
    paymentId: null
  };

  test('Step 1: Create customer', async ({ request }) => {
    const res = await request.post('/customers', {
      data: { name: 'John', email: 'john@example.com' }
    });
    testState.customerId = (await res.json()).id;
  });

  test('Step 2: Create order', async ({ request }) => {
    expect(testState.customerId).toBeDefined();
    
    const res = await request.post('/orders', {
      data: { customerId: testState.customerId, amount: 500 }
    });
    testState.orderId = (await res.json()).id;
  });

  test('Step 3: Process payment', async ({ request }) => {
    expect(testState.orderId).toBeDefined();
    
    const res = await request.post('/payments', {
      data: { orderId: testState.orderId, method: 'card' }
    });
    testState.paymentId = (await res.json()).id;
  });

  test('Step 4: Verify workflow', async ({ request }) => {
    const orderRes = await request.get(`/orders/${testState.orderId}`);
    const order = await orderRes.json();
    
    expect(order.status).toBe('completed');
    expect(order.paymentId).toBe(testState.paymentId);
  });
});
```

---

## BONUS: COMMON INTERVIEW TIPS

1. **Know Playwright vs Cypress vs Selenium trade-offs**
   - Playwright: Multi-browser, async, network interception
   - Cypress: Better DX, real-time reload, single browser
   - Selenium: Language-agnostic, mature, heavier

2. **Understand network concepts**: Status codes, headers, authentication, CORS, redirects

3. **Performance metrics**: TTFB, response time, throughput, latency

4. **Security in tests**: Never hardcode credentials, use environment variables

5. **CI/CD integration**: Docker, parallel execution, reporting

6. **API best practices**: RESTful conventions, error handling, pagination, throttling

---

**Good luck with your interview preparation! 🚀**
