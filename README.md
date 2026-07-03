# Online Examination Portal

A production-ready online examination platform built with **React 19 + Vite + Tailwind CSS** frontend and **Google Apps Script + Google Sheets** as the only backend and database.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Framer Motion, Chart.js |
| Backend | Google Apps Script (Web App) |
| Database | Google Sheets ONLY |
| Email | Gmail Service (via GAS) |

## Features

### Admin Dashboard
- **Dashboard Analytics**: Total candidates, tests, scores, pass/fail rates with charts
- **Candidate Management**: CRUD, bulk import/export, enable/disable, reset password
- **Test Management**: Create, edit, delete, duplicate, archive tests
- **Question Bank**: MCQ, Multiple Correct, True/False, Fill Blank, Numerical with rich text support
- **Results**: View all submissions, export to CSV/PDF
- **Settings**: Configure institute, passing marks, negative marking, notifications

### Candidate Portal
- **Login**: Candidate ID + Password (validated against Google Sheet)
- **Dashboard**: View assigned tests, progress, recent activity
- **Test Interface**: Question palette, timer, auto-save, mark for review, fullscreen
- **Results**: Score, grade, detailed report, download certificate
- **Security**: Auto-submit on timeout, tab switch warning, fullscreen enforcement

### Security Features
- Server-side time validation (no client bypass)
- Auto-save responses to Google Sheets
- Resume from last saved answer
- Disable right-click, copy-paste during exam
- Tab switch detection with warning
- Fullscreen enforcement
- Random question/option shuffling

## Tech Stack

- **React 19** + **Vite**
- **React Router** (routing)
- **Tailwind CSS** (styling)
- **React Hook Form** (forms)
- **Framer Motion** (animations)
- **Chart.js** + **react-chartjs-2** (analytics)
- **React Hot Toast** (notifications)
- **Lucide React** (icons)
- **Axios** (HTTP requests)

## Project Structure

```
exam-portal/
├── src/
│   ├── components/
│   │   ├── StatCard.jsx
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   └── ConfirmDialog.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminCandidates.jsx
│   │   ├── AdminTests.jsx
│   │   ├── AdminQuestions.jsx
│   │   ├── AdminResults.jsx
│   │   ├── AdminSettings.jsx
│   │   ├── CandidateDashboard.jsx
│   │   ├── CandidateTests.jsx
│   │   ├── CandidateResults.jsx
│   │   └── NotFoundPage.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── CandidateLayout.jsx
│   ├── hooks/
│   │   ├── useCandidates.js
│   │   ├── useTests.js
│   │   ├── useQuestions.js
│   │   └── useDashboard.js
│   ├── services/
│   │   └── gasService.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/
│   │   ├── cn.js
│   │   └── formatters.js
│   ├── config/
│   │   └── config.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── gas-backend/
│   └── Code.gs
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## Setup Instructions

### 1. Google Sheets Setup

1. Open the provided Google Sheet: `https://docs.google.com/spreadsheets/d/184Zbu1wkyRCXegJMa_5Zd3iyRimQSKbKjvanIIYXczM/edit`
2. Go to **Extensions → Apps Script**
3. Replace the default code with the contents of `gas-backend/Code.gs`
4. Save the project (Ctrl+S)
5. Click **Deploy → New deployment**
6. Select type: **Web app**
7. Execute as: **Me**
8. Who has access: **Anyone**
9. Click **Deploy** and authorize permissions
10. Copy the **Web App URL**

### 2. Frontend Setup

```bash
# Extract the project
cd exam-portal

# Install dependencies
npm install

# Update the GAS URL in src/config/config.js
# Replace GAS_URL with your deployed Web App URL

# Start development server
npm run dev
```

### 3. Admin Login

- **Username**: `admin`
- **Password**: `Admin@123`

Edit these in `src/config/config.js` if needed.

### 4. Candidate Login

Candidates are authenticated against the **Candidates** sheet. Add candidates via the admin panel or directly in the sheet with format:

| ID | Name | RollNumber | RegNumber | Email | Phone | Branch | Department | Semester | Section | Password | AssignedTests | Remarks | Status |

## Google Sheets Structure

The GAS backend automatically creates these sheets if they don't exist:

| Sheet | Purpose |
|-------|---------|
| Candidates | Student records and credentials |
| Tests | Examination definitions |
| Questions | Question bank |
| Responses | Auto-saved answers |
| Results | Evaluated scores |
| Logs | Activity tracking |
| Settings | Portal configuration |
| EmailQueue | Pending email notifications |

## Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder will contain the production build. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### Google Apps Script Deployment

1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Paste `Code.gs` content
4. Deploy as Web App
5. Update `GAS_URL` in frontend config

## Key Features

### Server-Side Time Validation
Tests can only be accessed during the configured start/end time. The server validates the current time before sending questions.

### Auto-Save
Every answer is automatically saved to Google Sheets. If the browser closes, the candidate can resume from the last saved answer.

### Email Automation
Upon submission, emails are automatically sent to:
- **Candidate**: Score, percentage, grade, answer key
- **Admin**: Complete response, submission time, CSV attachment

### Randomization
- Shuffle questions per student
- Shuffle options per question
- Different order for every candidate

### Question Types
- Single Correct MCQ
- Multiple Correct MCQ
- True/False
- Fill in the Blank
- Numerical
- Image-based (with URL support)

## Security Notes

This is a lightweight examination system. For high-stakes exams, consider additional measures:
- Proctoring software integration
- IP restriction
- Webcam monitoring
- Biometric verification

## License

MIT
