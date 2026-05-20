import { test, expect } from '@playwright/test';
import { headers } from '../../config/headers.js';
import { addcustomerdata } from '../../testdata/apidata.js';
import APIHelper from '../../helpers/apiHelper.js';
import fs from 'fs';
import path from 'path';

test('add customer', async ({ request }) => {
  const response = await request.post('addcustomer', {
    headers: headers,
    data: addcustomerdata
  });

  const responseBody = await response.json();
  
  // Check status
  APIHelper.checkStatus(response, 200);
  
  // Log response
  APIHelper.log(responseBody);

  // Validate schema
  APIHelper.validateSchema(responseBody, {
    dkyclink: 'string'
  });

  const dkyclink = APIHelper.getValue(responseBody, 'dkyclink');
  const id = APIHelper.getUrlParam(dkyclink, 'd');

  console.log('vciprefid:', id);

  const filepath = path.join(process.cwd(), 'testdata', 'vcipref.json');
  fs.writeFileSync(filepath, JSON.stringify({ id }, null, 2));
})