export const environments = {
  dev: {
    baseURL: 'https://dev-dkyc-cfa-api.example.com/api/dkyc/',
    apikey: process.env.DEV_API_KEY || '',
    timeout: 30000
  },
  
  staging: {
    baseURL: 'https://uat-dkyc-cfa-api.cimfinance.mu/api/dkyc/',
    apikey: process.env.STAGING_API_KEY || '',
    timeout: 30000
  },
  
  production: {
    baseURL: 'https://federal.idflow.info/workers/los-api/v1/',
    // 'https://sws-portal.syntizen.com/cfa/api/dkyc/',
    apikey: process.env.PROD_API_KEY || '',
    timeout: 30000
  }
};

// Get current environment from process.env.ENV, default to staging
export const currentEnv = process.env.ENV || 'staging';
export const config = environments[currentEnv];

// ✅ SECURITY: Detailed logging without exposing sensitive data
const envLog = `
======================================================================
🌍 ENVIRONMENT CONFIGURATION
======================================================================
📍 Environment: ${currentEnv.toUpperCase()}
🔗 Base URL: ${config.baseURL}
⏱️  Timeout: ${config.timeout}ms
🔑 API Key: ${config.apikey ? '✅ Loaded' : '❌ NOT FOUND'}
======================================================================
`;

console.log(envLog);

// ⚠️ Warn if API key is missing
if (!config.apikey) {
  console.warn(`⚠️ [SECURITY WARNING] No API key found for ${currentEnv} environment. Set ${currentEnv.toUpperCase()}_API_KEY environment variable.`);
}

// Export for use in tests (to attach to report)
export const environmentInfo = {
  environment: currentEnv,
  baseURL: config.baseURL,
  timeout: config.timeout,
  apiKeyLoaded: !!config.apikey
};
