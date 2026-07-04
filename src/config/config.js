// Admin configuration - Change these as needed
export const ADMIN_CONFIG = {
  username: 'admin',
  password: 'Admin@123',
};

// Sheet ID from the provided Google Sheet
export const SHEET_ID = '184Zbu1wkyRCXegJMa_5Zd3iyRimQSKbKjvanIIYXczM';

// Google Apps Script Web App URL (to be updated after deployment)
export const GAS_URL = 'https://exam-portal-mrvivekkr.vercel.app/api/gas';
// Deployment ID: AKfycbzN4tOEfxKjSc2eA4muIbYpWsquAyJTXCnnEYol_dJdCLBxkSjJptdrGSLS5pETr16RIg
// Institute settings
export const INSTITUTE = {
  name: 'Online Examination Portal',
  logo: null,
};

// Default test settings
export const DEFAULT_TEST_SETTINGS = {
  duration: 60,
  passingMarks: 40,
  negativeMarking: 0,
  maxAttempts: 1,
  shuffleQuestions: false,
  shuffleOptions: false,
  autoSubmit: true,
  showScore: true,
  showAnswers: true,
  passwordProtected: false,
  certificateEnabled: false,
};
