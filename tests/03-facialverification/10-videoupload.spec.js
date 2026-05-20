import {expect, test} from '@playwright/test';
import  { headers }  from '../../config/headers.js';
import {videoupload} from '../../testdata/facialdata.js';


const { 'Content-Type': _, ...cleanHeaders } = headers;
test('videoupload', async ({ request }) => {



  const response = await request.post(
    'UploadVCIPRecordedVideo',
    {
      headers: cleanHeaders,
      multipart: videoupload()
    }
  );
 const responseBody = await response.json();
  console.log(responseBody);
  
});