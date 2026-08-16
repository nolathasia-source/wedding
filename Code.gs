/**
 * WEDDING RSVP — Google Apps Script backend
 * ------------------------------------------------------------
 * What this does:
 *  - doPost()  → receives RSVP submissions from the website and
 *                appends a new row to a "RSVP" sheet.
 *  - doGet()   → with ?action=wishes, returns all submitted
 *                wishes as JSON so the website can display them.
 *
 * SETUP (see README.md "Connect Google Sheets" for full steps):
 *  1. Create a new Google Sheet.
 *  2. Extensions → Apps Script → paste this file's contents in.
 *  3. Deploy → New deployment → type "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the Web App URL into config.js → appsScriptUrl.
 */

const SHEET_NAME = "RSVP";

function doGet(e) {
  const action = e.parameter.action;
  if (action === "wishes") {
    return getWishes_();
  }
  return jsonResponse_({ status: "ok", message: "Wedding RSVP API is running." });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const name = (data.name || "").toString().trim();
    const attendance = (data.attendance || "").toString().trim();
    const guests = (data.guests || "").toString().trim();
    const message = (data.message || "").toString().trim();

    if (!name || !attendance || !message) {
      return jsonResponse_({ status: "error", error: "Missing required fields." });
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, guests, message]);

    return jsonResponse_({ status: "success" });
  } catch (err) {
    return jsonResponse_({ status: "error", error: err.toString() });
  }
}

/* ---------- helpers ---------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Full Name", "Attendance", "Number of Guests", "Message"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getWishes_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  values.shift(); // drop header row

  const wishes = values
    .filter((row) => row[1] && row[4]) // must have name + message
    .map((row) => ({
      timestamp: row[0],
      name: row[1],
      attendance: row[2],
      guests: row[3],
      message: row[4],
    }))
    .reverse(); // newest first

  return jsonResponse_({ status: "ok", wishes: wishes });
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
