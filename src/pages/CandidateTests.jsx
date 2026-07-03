import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, Lock, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTests } from '../hooks/useTests';
import { Modal } from '../components/Modal';
import { formatDuration, formatDateTime } from '../utils/formatters';
import { cn } from '../utils/cn';

export function CandidateTests() {
  const { user } = useAuth();
  const { tests } = useTests();
  const [selectedTest, setSelectedTest] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const assignedTests = tests.filter(t => user?.assignedTests?.includes(t.id));
  const now = new Date();

  const getTestStatus = (test) => {
    const start = new Date(test.startDate + 'T' + test.startTime);
    const end = new Date(test.endDate + 'T' + test.endTime);
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    return 'active';
  };

  const openPreview = (test) => {
    setSelectedTest(test);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tests</h1>
        <p className="text-sm text-gray-500 mt-1">View and attempt your assigned examinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tests.map((test, i) => {
          const status = getTestStatus(test);
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'rounded-2xl border p-5 bg-white dark:bg-gray-900 transition-all hover:shadow-md',
                status === 'active' ? 'border-green-200 dark:border-green-800' :
                status === 'upcoming' ? 'border-yellow-200 dark:border-yellow-800' :
                'border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                  <p className="text-sm text-gray-500">{test.subject}</p>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  status === 'active' ? 'bg-green-100 text-green-700' :
                  status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {status === 'active' ? 'Active' : status === 'upcoming' ? 'Upcoming' : 'Expired'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(test.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(test.startDate, test.startTime)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openPreview(test)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Details
                </button>
                {status === 'active' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
                    <Play className="w-4 h-4" /> Start
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Test Details" size="md">
        {selectedTest && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">{selectedTest.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{selectedTest.subject}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium">{formatDuration(selectedTest.duration)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Passing Marks</p>
                <p className="text-sm font-medium">{selectedTest.passingMarks}%</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Negative Marking</p>
                <p className="text-sm font-medium">{selectedTest.negativeMarking || 'None'}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Max Attempts</p>
                <p className="text-sm font-medium">{selectedTest.maxAttempts}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Instructions</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">{selectedTest.instructions}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
