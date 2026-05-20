
import { test } from '@playwright/test';
import { DocService } from '../../services/docservice.js';
import { docdata } from '../../testdata/docdata.js';

test('docverification', async ({ request }) => {

    const doc = new DocService(request);

const result= await doc.docdata(docdata)

});