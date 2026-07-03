import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, ChevronLeft, ChevronRight, Flag, Send,
  Maximize, Minimize, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTests } from '../hooks/useTests';
import { useQuestions } from '../hooks/useQuestions';
import { saveResponse } from '../services/gasService';
import { shuffleArray, generateId } from '../utils/formatters';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

export function ExamInterface() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tests } = useTests();
  const { questions: rawQuestions } = useQuestions(testId);

  const test = tests.find(t => t.id === testId);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [visited, setVisited] = useState(new Set([0]));
  const timerRef = useRef(null);

  useEffect(() => {
    if (!test || !rawQuestions.length) return;
    let qs = [...rawQuestions];
    if (test.shuffleQuestions === 'true') qs = shuffleArray(qs);
    setQuestions(qs);
    setTimeLeft(test.duration * 60);
  }, [test, rawQuestions]);

  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleAutoSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [examStarted, timeLeft]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && examStarted) {
        toast.error('Warning: Tab switching detected!', { duration: 3000 });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [examStarted]);

  const handleAutoSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    toast.error('Time is up! Auto-submitting...');
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    let correct = 0, wrong = 0, skipped = 0, totalMarks = 0, obtainedMarks = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      const marks = parseFloat(q.marks) || 1;
      const negMarks = parseFloat(q.negativeMarks) || 0;
      totalMarks += marks;
      if (!ans) { skipped++; }
      else if (ans === q.correctAnswer) { correct++; obtainedMarks += marks; }
      else { wrong++; obtainedMarks -= negMarks; }
    });
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    toast.success(`Exam submitted! Score: ${percentage}%`);
    navigate('/candidate/results');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    saveResponse({ id: generateId(), candidateId: user?.id, candidateName: user?.name, testId, questionId, selectedAnswer: answer, timestamp: new Date().toISOString() });
  };

  const toggleReview = (questionId) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
    setVisited(prev => new Set(prev).add(index));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!test) return <div className="p-8 text-center">Loading...</div>;

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{test.name}</h2>
          <p className="text-gray-500 mb-6">{test.subject}</p>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="font-medium">{test.duration} minutes</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Questions</span><span className="font-medium">{questions.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Passing</span><span className="font-medium">{test.passingMarks}%</span></div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-400 text-sm mb-2">Instructions</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-500 whitespace-pre-line">{test.instructions || '1. Read all questions carefully.\n2. Do not switch tabs.\n3. Auto-submit on timeout.\n4. Mark for review if unsure.'}</p>
          </div>
          <button onClick={() => { setExamStarted(true); toggleFullscreen(); }} className="w-full py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">Start Examination</button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = currentQuestion?.options?.split(',').map(o => o.trim()) || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{test.name}</h2>
          <p className="text-xs text-gray-500">{currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-mono font-medium', timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300')}>
            <Clock className="w-4 h-4" />{formatTime(timeLeft)}
          </div>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto w-full">
              <div className="mb-6">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Question {currentIndex + 1}</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2">{currentQuestion?.text}</h3>
              </div>
              <div className="space-y-3">
                {options.map((option, i) => {
                  const isSelected = answers[currentQuestion?.id] === option;
                  return (
                    <button key={i} onClick={() => handleAnswer(currentQuestion.id, option)} className={cn('w-full text-left p-4 rounded-xl border transition-all duration-200', isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')}>
                      <span className="font-mono text-xs text-gray-400 mr-3">{String.fromCharCode(65 + i)}</span>{option}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-8">
                <button onClick={() => toggleReview(currentQuestion.id)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors', markedForReview.has(currentQuestion.id) ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200')}>
                  <Flag className="w-4 h-4" />{markedForReview.has(currentQuestion.id) ? 'Unmark' : 'Mark for Review'}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => goToQuestion(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /> Previous</button>
                  <button onClick={() => goToQuestion(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 disabled:opacity-30 transition-colors">Next <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 hidden lg:block overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Question Palette</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const isAnswered = !!answers[q.id];
              const isMarked = markedForReview.has(q.id);
              const isVisited = visited.has(i);
              return (
                <button key={q.id} onClick={() => goToQuestion(i)} className={cn('w-10 h-10 rounded-lg text-sm font-medium transition-colors', currentIndex === i ? 'ring-2 ring-primary-500' : '', isAnswered ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : isMarked ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : isVisited ? 'bg-gray-100 dark:bg-gray-800 text-gray-600' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400')}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-6 space-y-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30" /><span className="text-gray-500">Answered</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900/30" /><span className="text-gray-500">Marked for Review</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800" /><span className="text-gray-500">Visited</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-gray-200 dark:border-gray-700" /><span className="text-gray-500">Not Visited</span></div>
          </div>
          <button onClick={() => setShowSubmitConfirm(true)} className="w-full mt-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">Submit Exam</button>
        </div>
      </div>

      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submit Examination?</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <p>Answered: {Object.keys(answers).length} / {questions.length}</p>
                <p>Marked for Review: {markedForReview.size}</p>
                <p>Unanswered: {questions.length - Object.keys(answers).length}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSubmitConfirm(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">Confirm Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
