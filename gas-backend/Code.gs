// ============================================
// ONLINE EXAMINATION PORTAL - GOOGLE APPS SCRIPT BACKEND
// ============================================

const SPREADSHEET_ID = '184Zbu1wkyRCXegJMa_5Zd3iyRimQSKbKjvanIIYXczM';

// Required sheets configuration
const SHEETS = {
  Candidates: ['ID', 'Name', 'RollNumber', 'RegNumber', 'Email', 'Phone', 'Branch', 'Department', 'Semester', 'Section', 'Password', 'AssignedTests', 'Remarks', 'Status', 'CreatedAt'],
  Tests: ['ID', 'Name', 'Subject', 'Description', 'Instructions', 'Duration', 'StartDate', 'StartTime', 'EndDate', 'EndTime', 'PassingMarks', 'NegativeMarking', 'MaxAttempts', 'ShuffleQuestions', 'ShuffleOptions', 'AutoSubmit', 'ShowScore', 'ShowAnswers', 'PasswordProtected', 'Password', 'CertificateEnabled', 'Status', 'CreatedAt'],
  Questions: ['ID', 'TestID', 'Type', 'Text', 'Options', 'CorrectAnswer', 'Marks', 'NegativeMarks', 'Explanation', 'Hint', 'Difficulty', 'Topic', 'Chapter', 'Tags', 'Image', 'CreatedAt'],
  Responses: ['ID', 'CandidateID', 'CandidateName', 'TestID', 'TestName', 'QuestionID', 'Question', 'SelectedAnswer', 'CorrectAnswer', 'Marks', 'Timestamp', 'AttemptNumber'],
  Results: ['ID', 'CandidateID', 'CandidateName', 'TestID', 'TestName', 'Marks', 'TotalMarks', 'Percentage', 'Grade', 'Status', 'TimeTaken', 'SubmissionTime', 'AttemptNumber'],
  Logs: ['ID', 'Type', 'CandidateID', 'TestID', 'Details', 'Timestamp'],
  Settings: ['Key', 'Value'],
  EmailQueue: ['ID', 'To', 'Subject', 'Body', 'Status', 'CreatedAt', 'SentAt']
};

// ============================================
// INITIALIZATION
// ============================================

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Exam Portal API is running',
    version: '1.0.0'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // Initialize sheets if needed
    ensureSheetsExist();

    switch (action) {
      // Candidate APIs
      case 'getCandidates': return jsonResponse(getCandidates());
      case 'getCandidate': return jsonResponse(getCandidate(data.candidateId));
      case 'createCandidate': return jsonResponse(createCandidate(data));
      case 'updateCandidate': return jsonResponse(updateCandidate(data));
      case 'deleteCandidate': return jsonResponse(deleteCandidate(data.candidateId));

      // Test APIs
      case 'getTests': return jsonResponse(getTests());
      case 'getTest': return jsonResponse(getTest(data.testId));
      case 'createTest': return jsonResponse(createTest(data));
      case 'updateTest': return jsonResponse(updateTest(data));
      case 'deleteTest': return jsonResponse(deleteTest(data.testId));

      // Question APIs
      case 'getQuestions': return jsonResponse(getQuestions(data.testId));
      case 'createQuestion': return jsonResponse(createQuestion(data));
      case 'updateQuestion': return jsonResponse(updateQuestion(data));
      case 'deleteQuestion': return jsonResponse(deleteQuestion(data.questionId));

      // Response APIs
      case 'getResponses': return jsonResponse(getResponses(data));
      case 'saveResponse': return jsonResponse(saveResponse(data));

      // Result APIs
      case 'getResults': return jsonResponse(getResults(data));
      case 'saveResult': return jsonResponse(saveResult(data));

      // Auth APIs
      case 'candidateLogin': return jsonResponse(candidateLogin(data.candidateId, data.password));

      // Dashboard
      case 'getDashboardStats': return jsonResponse(getDashboardStats());

      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// ============================================
// SHEET MANAGEMENT
// ============================================

function ensureSheetsExist() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const existingSheets = ss.getSheets().map(s => s.getName());

  for (const [sheetName, headers] of Object.entries(SHEETS)) {
    if (!existingSheets.includes(sheetName)) {
      const sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    }
  }
}

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || '');
    return obj;
  });
}

function appendRow(sheetName, data) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => data[h] || '');
  sheet.appendRow(row);
  return data;
}

function updateRow(sheetName, id, data, idColumn = 'ID') {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf(idColumn);

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] == id) {
      headers.forEach((h, col) => {
        if (data[h] !== undefined) {
          sheet.getRange(i + 1, col + 1).setValue(data[h]);
        }
      });
      return data;
    }
  }
  return null;
}

function deleteRow(sheetName, id, idColumn = 'ID') {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const idIndex = values[0].indexOf(idColumn);

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] == id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// ============================================
// CANDIDATE APIs
// ============================================

function getCandidates() {
  return { success: true, data: getSheetData('Candidates') };
}

function getCandidate(candidateId) {
  const candidates = getSheetData('Candidates');
  const candidate = candidates.find(c => c.ID === candidateId);
  return { success: true, data: candidate || null };
}

function createCandidate(data) {
  data.CreatedAt = new Date().toISOString();
  appendRow('Candidates', data);
  return { success: true, data };
}

function updateCandidate(data) {
  updateRow('Candidates', data.ID || data.id, data);
  return { success: true, data };
}

function deleteCandidate(candidateId) {
  deleteRow('Candidates', candidateId);
  return { success: true };
}

function candidateLogin(candidateId, password) {
  const candidates = getSheetData('Candidates');
  const candidate = candidates.find(c => c.ID === candidateId && c.Password === password);

  if (!candidate) {
    return { success: false, error: 'Invalid credentials' };
  }

  if (candidate.Status !== 'Active') {
    return { success: false, error: 'Account is disabled' };
  }

  // Log the login
  logEvent('LOGIN', candidateId, null, 'Candidate logged in');

  return { 
    success: true, 
    data: {
      id: candidate.ID,
      name: candidate.Name,
      firstName: candidate.Name.split(' ')[0],
      email: candidate.Email,
      rollNumber: candidate.RollNumber,
      regNumber: candidate.RegNumber,
      branch: candidate.Branch,
      department: candidate.Department,
      semester: candidate.Semester,
      section: candidate.Section,
      course: candidate.Branch,
      assignedTests: candidate.AssignedTests,
      completedUnits: candidate.Remarks || 'No units completed',
    }
  };
}

// ============================================
// TEST APIs
// ============================================

function getTests() {
  return { success: true, data: getSheetData('Tests') };
}

function getTest(testId) {
  const tests = getSheetData('Tests');
  return { success: true, data: tests.find(t => t.ID === testId) || null };
}

function createTest(data) {
  data.CreatedAt = new Date().toISOString();
  appendRow('Tests', data);
  return { success: true, data };
}

function updateTest(data) {
  updateRow('Tests', data.ID || data.id, data);
  return { success: true, data };
}

function deleteTest(testId) {
  deleteRow('Tests', testId);
  return { success: true };
}

// ============================================
// QUESTION APIs
// ============================================

function getQuestions(testId) {
  const questions = getSheetData('Questions');
  if (testId) {
    return { success: true, data: questions.filter(q => q.TestID === testId) };
  }
  return { success: true, data: questions };
}

function createQuestion(data) {
  data.CreatedAt = new Date().toISOString();
  appendRow('Questions', data);
  return { success: true, data };
}

function updateQuestion(data) {
  updateRow('Questions', data.ID || data.id, data);
  return { success: true, data };
}

function deleteQuestion(questionId) {
  deleteRow('Questions', questionId);
  return { success: true };
}

// ============================================
// RESPONSE APIs
// ============================================

function getResponses(filters) {
  const responses = getSheetData('Responses');
  if (filters?.candidateId) {
    return { success: true, data: responses.filter(r => r.CandidateID === filters.candidateId) };
  }
  if (filters?.testId) {
    return { success: true, data: responses.filter(r => r.TestID === filters.testId) };
  }
  return { success: true, data: responses };
}

function saveResponse(data) {
  data.Timestamp = new Date().toISOString();
  appendRow('Responses', data);
  return { success: true };
}

// ============================================
// RESULT APIs
// ============================================

function getResults(filters) {
  const results = getSheetData('Results');
  if (filters?.candidateId) {
    return { success: true, data: results.filter(r => r.CandidateID === filters.candidateId) };
  }
  return { success: true, data: results };
}

function saveResult(data) {
  data.SubmissionTime = new Date().toISOString();
  appendRow('Results', data);

  // Send emails
  sendResultEmails(data);

  return { success: true };
}

// ============================================
// DASHBOARD STATS
// ============================================

function getDashboardStats() {
  const candidates = getSheetData('Candidates');
  const tests = getSheetData('Tests');
  const results = getSheetData('Results');

  const totalCandidates = candidates.length;
  const totalTests = tests.length;
  const activeTests = tests.filter(t => t.Status === 'Active').length;
  const upcomingTests = tests.filter(t => t.Status === 'Upcoming').length;
  const completedTests = tests.filter(t => t.Status === 'Completed').length;

  const percentages = results.map(r => parseFloat(r.Percentage) || 0);
  const averageScore = percentages.length > 0 
    ? (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1)
    : 0;
  const highestScore = percentages.length > 0 ? Math.max(...percentages) : 0;
  const lowestScore = percentages.length > 0 ? Math.min(...percentages) : 0;

  const passCount = results.filter(r => r.Status === 'Pass').length;
  const passPercentage = results.length > 0 ? ((passCount / results.length) * 100).toFixed(1) : 0;
  const failPercentage = (100 - passPercentage).toFixed(1);

  return {
    success: true,
    data: {
      totalCandidates,
      totalTests,
      activeTests,
      upcomingTests,
      completedTests,
      averageScore,
      highestScore,
      lowestScore,
      passPercentage,
      failPercentage,
      recentSubmissions: results.slice(-5).reverse(),
      recentLogins: []
    }
  };
}

// ============================================
// LOGGING
// ============================================

function logEvent(type, candidateId, testId, details) {
  const log = {
    ID: 'LOG' + Date.now(),
    Type: type,
    CandidateID: candidateId || '',
    TestID: testId || '',
    Details: details,
    Timestamp: new Date().toISOString()
  };
  appendRow('Logs', log);
}

// ============================================
// EMAIL AUTOMATION
// ============================================

function sendResultEmails(result) {
  // Queue candidate email
  const candidateEmail = {
    ID: 'EM' + Date.now(),
    To: result.CandidateEmail || '',
    Subject: 'Exam Result: ' + result.TestName,
    Body: `Dear ${result.CandidateName},\n\nYour result for ${result.TestName} is ready.\n\nScore: ${result.Marks}/${result.TotalMarks}\nPercentage: ${result.Percentage}%\nGrade: ${result.Grade}\nStatus: ${result.Status}\n\nBest regards,\nExamination Portal`,
    Status: 'Pending',
    CreatedAt: new Date().toISOString(),
    SentAt: ''
  };
  appendRow('EmailQueue', candidateEmail);

  // Queue admin email
  const adminEmail = {
    ID: 'EM' + (Date.now() + 1),
    To: 'admin@examportal.com',
    Subject: 'New Submission: ' + result.TestName,
    Body: `Candidate ${result.CandidateName} (${result.CandidateID}) has submitted ${result.TestName}.\nScore: ${result.Marks}/${result.TotalMarks} (${result.Percentage}%)`,
    Status: 'Pending',
    CreatedAt: new Date().toISOString(),
    SentAt: ''
  };
  appendRow('EmailQueue', adminEmail);

  // Try to send immediately
  processEmailQueue();
}

function processEmailQueue() {
  const emails = getSheetData('EmailQueue').filter(e => e.Status === 'Pending');

  emails.forEach(email => {
    try {
      MailApp.sendEmail({
        to: email.To,
        subject: email.Subject,
        body: email.Body,
        name: 'Examination Portal'
      });

      // Update status
      const sheet = getSheet('EmailQueue');
      const values = sheet.getDataRange().getValues();
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === email.ID) {
          sheet.getRange(i + 1, 5).setValue('Sent');
          sheet.getRange(i + 1, 7).setValue(new Date().toISOString());
          break;
        }
      }
    } catch (e) {
      console.error('Email failed:', e);
    }
  });
}

// ============================================
// TIME VALIDATION (SERVER-SIDE)
// ============================================

function validateTestTime(testId) {
  const test = getTest(testId).data;
  if (!test) return { valid: false, error: 'Test not found' };

  const now = new Date();
  const start = new Date(test.StartDate + 'T' + test.StartTime);
  const end = new Date(test.EndDate + 'T' + test.EndTime);

  if (now < start) return { valid: false, error: 'Test has not started yet' };
  if (now > end) return { valid: false, error: 'Test has ended' };

  return { valid: true, test };
}
