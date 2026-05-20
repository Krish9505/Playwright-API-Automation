import {expect, test} from '@playwright/test';
import {headers}  from '../../config/headers.js';
import { ocrback } from '../../testdata/ocrdata.js';

test('ocrback', async ({ request }) => {

  
  const response = await request.post(
    'CimOvdOcr',
    {
      headers:headers,
      data: ocrback()
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
});