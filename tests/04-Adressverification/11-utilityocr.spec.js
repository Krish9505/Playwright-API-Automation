import {expect, test} from '@playwright/test';
import  { headers }  from '../../config/headers.js';
import { adress } from '../../testdata/adressdata.js';



test('imageliveness', async ({ request }) => {



  const response = await request.post(
    'UtilitybillOcr',
    {
      headers: headers,
      data: adress
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
});