import { SHEET_ID, GAS_URL } from '../config/config';

const BASE_URL = GAS_URL || '';

async function callGAS(action, payload = {}) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('GAS Error:', error);
    // Fallback: return mock data for development
    return getMockData(action, payload);
  }
}

// Mock data for development without GAS deployed
function getMockData(action, payload) {
  const mockCandidates = [
    { id: 'C001', name: 'Arjun Mehta', rollNumber: 'R2024001', regNumber: 'REG001', email: 'arjun@example.com', phone: '9876543210', branch: 'CSE', department: 'Engineering', semester: '4', section: 'A', password: 'pass123', assignedTests: 'T001,T002', remarks: '', status: 'Active' },
    { id: 'C002', name: 'Priya Sharma', rollNumber: 'R2024002', regNumber: 'REG002', email: 'priya@example.com', phone: '9876543211', branch: 'ECE', department: 'Engineering', semester: '4', section: 'B', password: 'pass456', assignedTests: 'T001', remarks: '', status: 'Active' },
    { id: 'C003', name: 'Rahul Verma', rollNumber: 'R2024003', regNumber: 'REG003', email: 'rahul@example.com', phone: '9876543212', branch: 'CSE', department: 'Engineering', semester: '6', section: 'A', password: 'pass789', assignedTests: 'T002,T003', remarks: '', status: 'Inactive' },
  ];

  const mockTests = [
    { id: 'T001', name: 'Python Basics', subject: 'Python Programming', description: 'Test on Python fundamentals', instructions: 'Read carefully. No negative marking.', duration: 60, startDate: '2026-07-10', startTime: '10:00', endDate: '2026-07-10', endTime: '12:00', passingMarks: 40, negativeMarking: 0, maxAttempts: 2, shuffleQuestions: 'true', shuffleOptions: 'true', autoSubmit: 'true', showScore: 'true', showAnswers: 'true', passwordProtected: 'false', password: '', certificateEnabled: 'false', status: 'Active', createdAt: '2026-07-01' },
    { id: 'T002', name: 'Web Development', subject: 'HTML/CSS/JS', description: 'Frontend basics test', instructions: 'All questions are MCQ.', duration: 45, startDate: '2026-07-15', startTime: '14:00', endDate: '2026-07-15', endTime: '15:30', passingMarks: 50, negativeMarking: 0.25, maxAttempts: 1, shuffleQuestions: 'true', shuffleOptions: 'false', autoSubmit: 'true', showScore: 'true', showAnswers: 'false', passwordProtected: 'false', password: '', certificateEnabled: 'false', status: 'Active', createdAt: '2026-07-02' },
    { id: 'T003', name: 'Data Structures', subject: 'DSA', description: 'Advanced DSA test', instructions: 'Negative marking applies.', duration: 90, startDate: '2026-07-20', startTime: '09:00', endDate: '2026-07-20', endTime: '11:00', passingMarks: 60, negativeMarking: 0.5, maxAttempts: 1, shuffleQuestions: 'false', shuffleOptions: 'false', autoSubmit: 'true', showScore: 'false', showAnswers: 'false', passwordProtected: 'true', password: 'dsa2026', certificateEnabled: 'true', status: 'Upcoming', createdAt: '2026-07-03' },
  ];

  const mockQuestions = [
    { id: 'Q001', testId: 'T001', type: 'MCQ', text: 'What is the output of print(2**3)?', options: '6,8,9,4', correctAnswer: '8', marks: 2, negativeMarks: 0, explanation: '2**3 = 8', hint: 'Think about exponentiation', difficulty: 'Easy', topic: 'Operators', chapter: 'Basics', tags: 'python,operators', image: '' },
    { id: 'Q002', testId: 'T001', type: 'MCQ', text: 'Which of the following is a mutable data type?', options: 'tuple,string,list,int', correctAnswer: 'list', marks: 2, negativeMarks: 0, explanation: 'Lists are mutable in Python', hint: 'Think about modification', difficulty: 'Easy', topic: 'Data Types', chapter: 'Variables', tags: 'python,datatypes', image: '' },
    { id: 'Q003', testId: 'T001', type: 'TrueFalse', text: 'Python is a compiled language.', options: 'True,False', correctAnswer: 'False', marks: 1, negativeMarks: 0, explanation: 'Python is interpreted', hint: '', difficulty: 'Easy', topic: 'Basics', chapter: 'Introduction', tags: 'python,basics', image: '' },
    { id: 'Q004', testId: 'T002', type: 'MCQ', text: 'Which tag is used for the largest heading?', options: 'h6,h1,head,header', correctAnswer: 'h1', marks: 2, negativeMarks: 0.25, explanation: 'h1 is the largest heading', hint: 'Think about hierarchy', difficulty: 'Easy', topic: 'HTML', chapter: 'Basics', tags: 'html,headings', image: '' },
  ];

  const mockResponses = [
    { id: 'R001', candidateId: 'C001', candidateName: 'Arjun Mehta', testId: 'T001', testName: 'Python Basics', questionId: 'Q001', question: 'What is the output of print(2**3)?', selectedAnswer: '8', correctAnswer: '8', marks: 2, timestamp: '2026-07-10T10:15:00', attemptNumber: 1 },
    { id: 'R002', candidateId: 'C001', candidateName: 'Arjun Mehta', testId: 'T001', testName: 'Python Basics', questionId: 'Q002', question: 'Which of the following is a mutable data type?', selectedAnswer: 'tuple', correctAnswer: 'list', marks: 0, timestamp: '2026-07-10T10:20:00', attemptNumber: 1 },
  ];

  const mockResults = [
    { id: 'RES001', candidateId: 'C001', candidateName: 'Arjun Mehta', testId: 'T001', testName: 'Python Basics', marks: 3, totalMarks: 5, percentage: 60, grade: 'C', status: 'Pass', timeTaken: 1200, submissionTime: '2026-07-10T10:30:00', attemptNumber: 1 },
  ];

  switch (action) {
    case 'getCandidates':
      return { success: true, data: mockCandidates };
    case 'getCandidate':
      return { success: true, data: mockCandidates.find(c => c.id === payload.candidateId) || null };
    case 'createCandidate':
      return { success: true, data: { ...payload, id: 'C' + Date.now() } };
    case 'updateCandidate':
      return { success: true, data: payload };
    case 'deleteCandidate':
      return { success: true };
    case 'getTests':
      return { success: true, data: mockTests };
    case 'getTest':
      return { success: true, data: mockTests.find(t => t.id === payload.testId) || null };
    case 'createTest':
      return { success: true, data: { ...payload, id: 'T' + Date.now() } };
    case 'updateTest':
      return { success: true, data: payload };
    case 'deleteTest':
      return { success: true };
    case 'getQuestions':
      return { success: true, data: mockQuestions.filter(q => q.testId === payload.testId) };
    case 'createQuestion':
      return { success: true, data: { ...payload, id: 'Q' + Date.now() } };
    case 'updateQuestion':
      return { success: true, data: payload };
    case 'deleteQuestion':
      return { success: true };
    case 'getResponses':
      return { success: true, data: mockResponses };
    case 'saveResponse':
      return { success: true };
    case 'getResults':
      return { success: true, data: mockResults };
    case 'saveResult':
      return { success: true };
    case 'candidateLogin':
      const cand = mockCandidates.find(c => c.id === payload.candidateId && c.password === payload.password);
      if (cand && cand.status === 'Active') {
        return { success: true, data: { ...cand, password: undefined } };
      }
      return { success: false, error: 'Invalid credentials or account inactive' };
    case 'getDashboardStats':
      return {
        success: true,
        data: {
          totalCandidates: mockCandidates.length,
          totalTests: mockTests.length,
          activeTests: mockTests.filter(t => t.status === 'Active').length,
          upcomingTests: mockTests.filter(t => t.status === 'Upcoming').length,
          completedTests: mockTests.filter(t => t.status === 'Completed').length,
          averageScore: 65,
          highestScore: 95,
          lowestScore: 30,
          passPercentage: 75,
          failPercentage: 25,
          recentSubmissions: mockResults.slice(0, 5),
          recentLogins: [],
        }
      };
    default:
      return { success: false, error: 'Unknown action' };
  }
}

// Candidate APIs
export const getCandidates = () => callGAS('getCandidates');
export const getCandidate = (candidateId) => callGAS('getCandidate', { candidateId });
export const createCandidate = (data) => callGAS('createCandidate', data);
export const updateCandidate = (data) => callGAS('updateCandidate', data);
export const deleteCandidate = (candidateId) => callGAS('deleteCandidate', { candidateId });

// Test APIs
export const getTests = () => callGAS('getTests');
export const getTest = (testId) => callGAS('getTest', { testId });
export const createTest = (data) => callGAS('createTest', data);
export const updateTest = (data) => callGAS('updateTest', data);
export const deleteTest = (testId) => callGAS('deleteTest', { testId });

// Question APIs
export const getQuestions = (testId) => callGAS('getQuestions', { testId });
export const createQuestion = (data) => callGAS('createQuestion', data);
export const updateQuestion = (data) => callGAS('updateQuestion', data);
export const deleteQuestion = (questionId) => callGAS('deleteQuestion', { questionId });

// Response APIs
export const getResponses = (filters) => callGAS('getResponses', filters);
export const saveResponse = (data) => callGAS('saveResponse', data);

// Result APIs
export const getResults = (filters) => callGAS('getResults', filters);
export const saveResult = (data) => callGAS('saveResult', data);

// Auth APIs
export const candidateLoginAPI = (candidateId, password) => callGAS('candidateLogin', { candidateId, password });

// Dashboard
export const getDashboardStats = () => callGAS('getDashboardStats');
