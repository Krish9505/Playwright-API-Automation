import { test, expect } from '@playwright/test';
import { authkeydata } from '../../testdata/apidata.js';
import { authkeyheaders } from '../../config/headers.js';
import APIHelper from '../../helpers/apiHelper.js';
import fs from 'fs';
import path from 'path';

test('Authkey', async ({ request }) => {
  const response = await request.post('userauthentication', {
    headers: authkeyheaders,
    data: authkeydata
    

  });

  const responseBody = await response.json();
  
  // Check status
  APIHelper.checkStatus(response, 200);
  
  // Log response
  APIHelper.log(responseBody);

  // Validate schema
  APIHelper.validateSchema(responseBody, {
    authkey: 'string'
  });

  // Extract auth key
  const authkey = APIHelper.getValue(responseBody, 'authkey');
  console.log('Auth Key:', authkey);

  // Save authkey to config file
  const filepath = path.join(process.cwd(), 'config', 'authkeyheaders.json');
  fs.writeFileSync(filepath, JSON.stringify({ authkey1: authkey }, null, 2));
  
  console.log('✅ Auth key saved successfully');
})