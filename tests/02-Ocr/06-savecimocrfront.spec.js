import {expect, test} from '@playwright/test';
import {headers}  from '../../config/headers.js';
import {savecimocrfront} from '../../testdata/ocrdata.js';


test('savecimocrfront', async ({ request }) => {



  const response = await request.post(
    'SaveCimOvdData',
    {
      headers:headers,
      data: savecimocrfront
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
});