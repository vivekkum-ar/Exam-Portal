import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, Copy, Archive, Clock, Calendar } from 'lucide-react';
import { useTests } from '../hooks/useTests';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { generateId, formatDuration } from '../utils/formatters';
import { DEFAULT_TEST_SETTINGS } from '../config/config';
import { cn } from '../utils/cn';

const initialForm = {
  name: '', subject: '', description: '', instructions: '',
  duration: DEFAULT_TEST_SETTINGS.duration,
  startDate: '', startTime: '', endDate: '', endTime: '',
  passingMarks: DEFAULT_TEST_SETTINGS.passingMarks,
  negativeMarking: DEFAULT_TEST_SETTINGS.negativeMarking,
  maxAttempts: DEFAULT_TEST_SETTINGS.maxAttempts,
  shuffleQuestions: false,
  shuffleOptions: false,
  autoSubmit: true,
  showScore: true,
  showAnswers: true,
  passwordProtected: false,
  password: '',
  certificateEnabled: false,
  status: 'Active',
};

export function AdminTests() {
  const { tests, loading, addTest, editTest, removeTest } = useTests();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (test) => {
    setEditing(test);
    setForm({ ...test });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = editing ? { ...form, id: editing.id } : { ...form, id: generateId() };
    const success = editing ? await editTest(data) : await addTest(data);
    if (success) setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await removeTest(deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const duplicateTest = async (test) => {
    const newTest = { ...test, id: generateId(), name: test.name + ' (Copy)', status: 'Active' };
    await addTest(newTest);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage examination tests</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Test
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Test Name' },
          { key: 'subject', label: 'Subject' },
          { key: 'duration', label: 'Duration', render: (v) => formatDuration(v) },
          { key: 'passingMarks', label: 'Pass %' },
          { key: 'negativeMarking', label: 'Neg Mark', render: (v) => v || '0' },
          { key: 'status', label: 'Status', render: (v) => (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              v === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              v === 'Upcoming' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
            )}>{v}</span>
          )},
        ]}
        data={tests}
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Edit"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => duplicateTest(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Duplicate"><Copy className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
          </>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Test' : 'Create Test'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Test Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Subject *</label>
              <input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Duration (min) *</label>
              <input type="number" required min="1" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Start Date *</label>
              <input type="date" required value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Start Time *</label>
              <input type="time" required value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">End Date *</label>
              <input type="date" required value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">End Time *</label>
              <input type="time" required value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Passing Marks (%)</label>
              <input type="number" min="0" max="100" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Negative Marking</label>
              <input type="number" step="0.25" min="0" value={form.negativeMarking} onChange={e => setForm(p => ({ ...p, negativeMarking: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Max Attempts</label>
              <input type="number" min="1" value={form.maxAttempts} onChange={e => setForm(p => ({ ...p, maxAttempts: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <option>Active</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Archived</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea rows="2" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instructions</label>
            <textarea rows="3" value={form.instructions} onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'shuffleQuestions', label: 'Shuffle Questions' },
              { key: 'shuffleOptions', label: 'Shuffle Options' },
              { key: 'autoSubmit', label: 'Auto Submit' },
              { key: 'showScore', label: 'Show Score' },
              { key: 'showAnswers', label: 'Show Answers' },
              { key: 'certificateEnabled', label: 'Certificate' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[opt.key]} onChange={e => setForm(p => ({ ...p, [opt.key]: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
              </label>
            ))}
          </div>

          {form.passwordProtected && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Test Password</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Test" message="Are you sure? This will also delete all associated questions and results." />
    </div>
  );
}
