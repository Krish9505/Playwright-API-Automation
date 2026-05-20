
import { headers } from '../config/headers.js'; 

// Create DocService class for API calls
export class DocService {
    
    // Constructor - save request object when creating new instance
    constructor(request) {
        // Store request so we can use it in methods
        this.request = request;
    }

    // Method to get document types
    async docdata(doc) {
        
        // Make POST request to API endpoint
        const response = await this.request.post('GetDocumentTypes', {
            headers: headers,  // Send headers with request
            data: doc          // Send document data with request
        });

        // Convert response from JSON to JavaScript object
        const responseBody = await response.json();
        
        // Print response to console (for debugging)
        console.log(responseBody);

        // Return the response data to test
        return responseBody;
    }
}