// =============================================
// Challenge Checkoff App — Google Apps Script
// =============================================
//
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet:
//    https://docs.google.com/spreadsheets/d/1LlJP-cBzjX9CDT9ba0pCZx611zpauJQCtUADWYSLL8I
//
// 2. Go to Extensions > Apps Script
//
// 3. Replace the contents of Code.gs with this file
//
// 4. Click "Deploy" > "New deployment"
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
//    - Click "Deploy" and authorize
//
// 5. Copy the deployment URL and paste it into:
//    src/api/sheetsApi.ts  →  SCRIPT_URL constant
//
// SHEET STRUCTURE:
// The script will auto-create a "Challenges" sheet with columns:
//   A: id | B: title | C: duration | D: createdAt | E: completedDays

var SHEET_NAME = 'Challenges';
var HEADERS = ['id', 'title', 'duration', 'createdAt', 'completedDays'];

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function rowToObject(row) {
  return {
    id: row[0] ? String(row[0]) : '',
    title: row[1] ? String(row[1]) : '',
    duration: row[2] ? String(row[2]) : '',
    createdAt: row[3] ? String(row[3]) : '',
    completedDays: row[4] ? String(row[4]) : '',
  };
}

function findRowIndex(sheet, id) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return i + 1; // 1-indexed row
  }
  return -1;
}

function doGet(e) {
  var action = e.parameter.action;
  var result;

  if (action === 'getChallenges') {
    result = handleGetChallenges();
  } else {
    result = { success: false, error: 'Unknown action: ' + action };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    var errResult = { success: false, error: 'Invalid JSON body' };
    return ContentService
      .createTextOutput(JSON.stringify(errResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var result;
  switch (body.action) {
    case 'createChallenge':
      result = handleCreateChallenge(body.title, body.duration);
      break;
    case 'toggleDay':
      result = handleToggleDay(body.id, body.day);
      break;
    case 'deleteChallenge':
      result = handleDeleteChallenge(body.id);
      break;
    default:
      result = { success: false, error: 'Unknown action: ' + body.action };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetChallenges() {
  try {
    var sheet = getSheet();
    var data = sheet.getDataRange().getValues();
    var challenges = [];
    // Skip header row (index 0)
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) { // skip empty rows
        challenges.push(rowToObject(data[i]));
      }
    }
    return { success: true, challenges: challenges };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

function handleCreateChallenge(title, duration) {
  try {
    var sheet = getSheet();
    var id = String(Date.now());
    var createdAt = new Date().toISOString();
    sheet.appendRow([id, title, duration, createdAt, '']);
    return {
      success: true,
      challenge: { id: id, title: title, duration: String(duration), createdAt: createdAt, completedDays: '' }
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

function handleToggleDay(id, day) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    var sheet = getSheet();
    var rowIndex = findRowIndex(sheet, id);
    if (rowIndex === -1) {
      lock.releaseLock();
      return { success: false, error: 'Challenge not found: ' + id };
    }

    var completedDaysCell = sheet.getRange(rowIndex, 5); // column E
    var raw = completedDaysCell.getValue() ? String(completedDaysCell.getValue()) : '';
    var days = raw === '' ? [] : raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });

    var dayNum = parseInt(day, 10);
    var idx = days.indexOf(dayNum);
    if (idx === -1) {
      days.push(dayNum);
    } else {
      days.splice(idx, 1);
    }
    days.sort(function(a, b) { return a - b; });

    var newValue = days.join(',');
    completedDaysCell.setValue(newValue);

    lock.releaseLock();
    return { success: true, completedDays: newValue };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

function handleDeleteChallenge(id) {
  try {
    var sheet = getSheet();
    var rowIndex = findRowIndex(sheet, id);
    if (rowIndex === -1) {
      return { success: false, error: 'Challenge not found: ' + id };
    }
    sheet.deleteRow(rowIndex);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
