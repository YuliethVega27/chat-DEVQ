// googleSheetsService.js
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const googleSheetsClient = new google.auth.GoogleAuth({
    credentials: {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL        
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

async function getResponseForTrigger(userTrigger) {
    const sheets = google.sheets({ version: 'v4', auth: await googleSheetsClient.getClient() });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'respuestas!A:E';  // Assuming the data is from columns A to E

    try {
        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });

        const rows = result.data.values;
        if (rows.length) {
            for (const row of rows) {
                // Normalize triggers into an array
                let triggers = row[0].split(',').map(trigger => trigger.trim().toLowerCase());

                // Check if any trigger is a substring of the user's input
                if (triggers.some(trigger => userTrigger.toLowerCase().includes(trigger))) {
                    const response = {
                        message: row[1],
                        type: row[2] ? row[2].trim().toLowerCase() : 'text',  // Normalize and default to 'text'
                        caption: row[3],
                        url: row[4]
                    };
                    return response;
                }
            }
        }
        console.log("No matching trigger found for:", userTrigger); // Log if no trigger matched
        return { message: 'No response found.', type: 'text' };
    } catch (error) {
        console.error('Error reading data from the spreadsheet:', error);
        return { message: 'Error accessing responses.', type: 'text' };
    }
}

export { getResponseForTrigger };
