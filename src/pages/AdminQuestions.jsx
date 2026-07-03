import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Copy, Eye } from 'lucide-react';
import { useTests } from '../hooks/useTests';
import { useQuestions } from '../hooks/useQuestions';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { generateId } from '../utils/formatters';
import { cn } from '../utils/cn';

const QUESTION_TYPES = ['MCQ', 'Multiple Correct', 'TrueFalse', 'FillBlank', 'Numerical'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const initialForm = {
  testId: '', type: 'MCQ', text: '', options: '', correctAnswer: '',
  marks: 1, negativeMarks: 0, explanation: '', hint: '',
  difficulty: 'Easy', topic: '', chapter: '', tags: '', image: ''
};

export function AdminQuestions() {
  const [searchParams] = useSearchParams();
  const initialTestId = searchParams.get('test') || '';

  const { tests } = useTests();
  const [selectedTest, setSelectedTest] = useState(initialTestId);
  const { questions, loading, addQuestion, editQuestion, removeQuestion } = useQuestions(selectedTest);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...initialForm, testId: selectedTest });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewQ, setPreviewQ] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...initialForm, testId: selectedTest });
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setEditing(q);
    setForm({ ...q });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = editing ? { ...form, id: editing.id } : { ...form, id: generateId() };
    const success = editing ? await editQuestion(data) : await addQuestion(data);
    if (success) setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await removeQuestion(deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const duplicateQuestion = async (q) => {
    const newQ = { ...q, id: generateId(), text: q.text + ' (Copy)' };
    await addQuestion(newQ);
  };

  const openPreview = (q) => {
    setPreviewQ(q);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Bank</h1>
          <p className="text-sm text-gray-500 mt-1">Manage examination questions</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTest}
            onChange={e => setSelectedTest(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All Tests</option>
            {tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'text', label: 'Question', render: (v) => <span className="truncate max-w-xs block">{v}</span> },
          { key: 'type', label: 'Type' },
          { key: 'marks', label: 'Marks' },
          { key: 'difficulty', label: 'Difficulty', render: (v) => (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              v === 'Easy' ? 'bg-green-100 text-green-700' :
              v === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            )}>{v}</span>
          )},
          { key: 'topic', label: 'Topic' },
        ]}
        data={questions}
        actions={(row) => (
          <>
            <button onClick={() => openPreview(row)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Preview"><Eye className="w-4 h-4" /></button>
            <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Edit"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => duplicateQuestion(row)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Duplicate"><Copy className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
          </>
        )}
      />

      {/* Question Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Question' : 'Add Question'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Test</label>
              <select required value={form.testId} onChange={e => setForm(p => ({ ...p, testId: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Test</option>
                {tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Question Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Question Text *</label>
            <textarea required rows="3" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
          {(form.type === 'MCQ' || form.type === 'Multiple Correct' || form.type === 'TrueFalse') && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Options (comma-separated)</label>
              <input value={form.options} onChange={e => setForm(p => ({ ...p, options: e.target.value }))} placeholder="Option A, Option B, Option C, Option D" className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Correct Answer *</label>
              <input required value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Marks</label>
                <input type="number" min="0" step="0.5" value={form.marks} onChange={e => setForm(p => ({ ...p, marks: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Neg Marks</label>
                <input type="number" min="0" step="0.25" value={form.negativeMarks} onChange={e => setForm(p => ({ ...p, negativeMarks: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Topic</label>
              <input value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Chapter</label>
              <input value={form.chapter} onChange={e => setForm(p => ({ ...p, chapter: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Explanation</label>
            <textarea rows="2" value={form.explanation} onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Hint</label>
            <input value={form.hint} onChange={e => setForm(p => ({ ...p, hint: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="python, loops, basics" className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">{editing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Question Preview" size="md">
        {previewQ && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{previewQ.text}</p>
            </div>
            {previewQ.options && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Options</p>
                {previewQ.options.split(',').map((opt, i) => (
                  <div key={i} className={cn(
                    'p-2 rounded-lg text-sm',
                    opt.trim() === previewQ.correctAnswer ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-700'
                  )}>
                    {opt.trim()}
                  </div>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Correct Answer</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{previewQ.correctAnswer}</p>
            </div>
            {previewQ.explanation && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Explanation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{previewQ.explanation}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Question" message="Are you sure you want to delete this question?" />
    </div>
  );
}
