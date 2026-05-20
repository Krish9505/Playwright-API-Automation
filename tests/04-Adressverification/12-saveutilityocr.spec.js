import {expect, test} from '@playwright/test';
import  { headers }  from '../../config/headers.js';
import { saveutility } from '../../testdata/adressdata.js';



test('imageliveness', async ({ request }) => {



  const response = await request.post(
    'SaveUtilityBill',
    {
      headers: headers,
      data: saveutility
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
}); 