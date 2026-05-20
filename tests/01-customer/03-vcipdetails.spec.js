import {expect, test} from '@playwright/test';
import {headers}  from '../../config/headers.js';
import {getvcipdetails} from '../../testdata/apidata.js';
import fs from 'fs';
import path from 'path';

test('vcipdetails', async ({ request }) => {
  
 
  const response = await request.post('GetVcipLinkDetails',
     {
      headers: headers,     // ✅ correct place
      data: getvcipdetails     // ✅ correct place
    });
console.log("BODY:", getvcipdetails);
  const responseBody = await response.json();
  console.log(responseBody);

  const vcipkey=responseBody.vcipkey;

  const filepath=path.join(process.cwd(), 'testdata','vcipkey.json');

  fs.writeFileSync(filepath, JSON.stringify({vcipkey}));

    expect(response.status()).toBe(200);
})
