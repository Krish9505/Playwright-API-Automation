import {expect, test} from '@playwright/test';
import {headers}  from '../../config/headers.js';
import { ocrfront } from '../../testdata/ocrdata.js';

test('ocrfront', async ({ request }) => {

  
  const response = await request.post(
    'CimOvdOcr',
    {
      headers:headers,
      data: ocrfront()
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
});