import {expect, test} from '@playwright/test';
import {headers}  from '../../config/headers.js';
import {savecimocrback2} from '../../testdata/ocrdata.js';

test('savecimocrback', async ({request}) => 
    
    {

      const response=  await request.post('SaveCimOvdData',
            {
                headers:headers,
                data:savecimocrback2
   }


        )

 const responseBody = await response.json();
  console.log(responseBody);


})

