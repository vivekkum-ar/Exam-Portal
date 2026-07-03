import { motion } from 'framer-motion';
import { Award, Download, FileText } from 'lucide-react';
import { getGrade, getGradeColor } from '../utils/formatters';
import { cn } from '../utils/cn';

export function CandidateResults() {
  const results = [
    { testName: 'Python Basics', marks: 3, totalMarks: 5, percentage: 60, grade: 'C', status: 'Pass', date: '10 Jul 2026' },
    { testName: 'Web Development', marks: 4, totalMarks: 4, percentage: 100, grade: 'A+', status: 'Pass', date: '15 Jul 2026' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Results</h1>
        <p className="text-sm text-gray-500 mt-1">View your examination performance</p>
      </div>

      <div className="space-y-4">
        {results.map((result, i) => (
          <motion.div
            key={result.testName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{result.testName}</h3>
                <p className="text-sm text-gray-500">{result.date}</p>
              </div>
              <div className="text-right">
                <span className={cn('text-2xl font-bold', getGradeColor(result.grade))}>{result.grade}</span>
                <p className={cn(
                  'text-xs font-medium',
                  result.status === 'Pass' ? 'text-green-600' : 'text-red-600'
                )}>{result.status}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{result.marks}/{result.totalMarks}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Percentage</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{result.percentage}%</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Rank</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">#3</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">
                <FileText className="w-4 h-4" /> View Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
