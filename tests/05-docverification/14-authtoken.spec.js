import { test, expect } from '@playwright/test';
import XLSX from 'xlsx';

test('authtoken', async ({ request }) => {

    // Read Excel File
    const workbook = XLSX.readFile(
        './testdata/datadriven.xlsx'
    );

    // Read Sheet
    const sheet = workbook.Sheets['Sheet1'];

    // Convert Sheet to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    // Loop all rows
    for (const row of data) {

        console.log(row.client_id);
        console.log(row.client_secret);

        // API Request
        const response = await request.post('auth/token', {

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },

            form: {
                grant_type: row.grant_type,
                client_id: row.client_id,
                client_secret: row.client_secret
            }
        });

        // Response Body
        const responseBody = await response.text();

        console.log(responseBody);

        console.log(response.status());

        // Validation
        //expect(response.status()).toBe(200);
    }
});