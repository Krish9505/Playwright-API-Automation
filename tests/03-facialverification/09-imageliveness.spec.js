import {expect, test} from '@playwright/test';
import  { headers }  from '../../config/headers.js';
import {imagelivenessdata} from '../../testdata/facialdata.js';



test('imageliveness', async ({ request }) => {



  const response = await request.post(
    'CheckImageLiveness',
    {
      headers: headers,
      data: imagelivenessdata
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
});