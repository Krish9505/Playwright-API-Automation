import {expect, test} from '@playwright/test';
import {headers}  from '../../config/headers.js';
import {slot} from '../../testdata/apidata.js';


test('createslot', async ({ request }) => {
  
 
  const response = await request.post('CreateSlot',
      {
          headers: headers,     // ✅ correct place
          data: slot     // ✅ correct place
        });
 const responseBody = await response.json();
  console.log(responseBody);

    })
