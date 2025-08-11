const { google } = require('googleapis');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Get form data from Netlify submission
  const data = JSON.parse(event.body);
  const { name, email, ...rest } = data; // Change this to match your form fields

  // Load credentials from environment variable or a local file
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS); // Or require('./creds.json')

  // Authenticate
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "YOUR_SHEET_ID"; // Replace with your actual Sheet ID

  // Prepare the row data
  const row = [name, email, ...Object.values(rest)];
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A1", // Adjust to your sheet/range
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
};