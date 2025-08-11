const { google } = require('googleapis');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Your original code here...
    // Get form data from Netlify submission
    const data = JSON.parse(event.body);
    const { name, email, ...rest } = data;

    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1n5E3KiSGpO0FO-F01Zqgk3DlQqp1dr8fOjqAe6fm2Bo";

    const row = [name, email, ...Object.values(rest)];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Submission failed",
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};