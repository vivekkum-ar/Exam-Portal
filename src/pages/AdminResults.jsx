import { useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { getResults } from '../services/gasService';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { getGrade, getGradeColor, formatDateTime } from '../utils/formatters';
import { cn } from '../utils/cn';

export function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Mock data for display
  const mockResults = [
    { id: 'RES001', candidateId: 'C001', candidateName: 'Arjun Mehta', testId: 'T001', testName: 'Python Basics', marks: 3, totalMarks: 5, percentage: 60, grade: 'C', status: 'Pass', timeTaken: 1200, submissionTime: '2026-07-10T10:30:00', attemptNumber: 1 },
    { id: 'RES002', candidateId: 'C002', candidateName: 'Priya Sharma', testId: 'T001', testName: 'Python Basics', marks: 4, totalMarks: 5, percentage: 80, grade: 'A', status: 'Pass', timeTaken: 900, submissionTime: '2026-07-10T10:25:00', attemptNumber: 1 },
    { id: 'RES003', candidateId: 'C001', candidateName: 'Arjun Mehta', testId: 'T002', testName: 'Web Development', marks: 2, totalMarks: 4, percentage: 50, grade: 'D', status: 'Pass', timeTaken: 1800, submissionTime: '2026-07-15T14:20:00', attemptNumber: 1 },
  ];

  const openDetail = (result) => {
    setSelectedResult(result);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h1>
          <p className="text-sm text-gray-500 mt-1">View and export examination results</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'candidateName', label: 'Candidate' },
          { key: 'testName', label: 'Test' },
          { key: 'marks', label: 'Score', render: (v, row) => `${v}/${row.totalMarks}` },
          { key: 'percentage', label: '%', render: (v) => `${v}%` },
          { key: 'grade', label: 'Grade', render: (v) => (
            <span className={cn('font-bold', getGradeColor(v))}>{v}</span>
          )},
          { key: 'status', label: 'Status', render: (v) => (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              v === 'Pass' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            )}>{v}</span>
          )},
          { key: 'timeTaken', label: 'Time', render: (v) => `${Math.floor(v/60)}m ${v%60}s` },
          { key: 'submissionTime', label: 'Submitted', render: (v) => formatDateTime(v) },
        ]}
        data={mockResults}
        actions={(row) => (
          <button onClick={() => openDetail(row)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="View Details">
            <FileText className="w-4 h-4" />
          </button>
        )}
      />

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Result Details" size="md">
        {selectedResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Candidate</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedResult.candidateName}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Test</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedResult.testName}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedResult.marks}/{selectedResult.totalMarks}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Percentage</p>
                <p className={cn('text-sm font-bold', getGradeColor(selectedResult.grade))}>{selectedResult.percentage}%</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Grade</p>
                <p className={cn('text-sm font-bold', getGradeColor(selectedResult.grade))}>{selectedResult.grade}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Status</p>
                <p className={cn(
                  'text-sm font-medium',
                  selectedResult.status === 'Pass' ? 'text-green-600' : 'text-red-600'
                )}>{selectedResult.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
