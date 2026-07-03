import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, UserCheck, UserX, KeyRound, Download, Upload } from 'lucide-react';
import { useCandidates } from '../hooks/useCandidates';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { generateId } from '../utils/formatters';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const initialForm = {
  name: '', rollNumber: '', regNumber: '', email: '', phone: '',
  branch: '', department: '', semester: '', section: '',
  password: '', assignedTests: '', remarks: '', status: 'Active'
};

export function AdminCandidates() {
  const { candidates, loading, addCandidate, editCandidate, removeCandidate } = useCandidates();
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

  const openEdit = (candidate) => {
    setEditing(candidate);
    setForm({ ...candidate });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = editing ? { ...form, id: editing.id } : { ...form, id: generateId() };
    const success = editing ? await editCandidate(data) : await addCandidate(data);
    if (success) setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await removeCandidate(deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (candidate) => {
    const newStatus = candidate.status === 'Active' ? 'Inactive' : 'Active';
    await editCandidate({ ...candidate, status: newStatus });
  };

  const resetPassword = async (candidate) => {
    const newPass = candidate.rollNumber + '@123';
    await editCandidate({ ...candidate, password: newPass });
    toast.success(`Password reset to: ${newPass}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage examination candidates</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Candidate
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'rollNumber', label: 'Roll No' },
          { key: 'regNumber', label: 'Reg No' },
          { key: 'email', label: 'Email' },
          { key: 'branch', label: 'Branch' },
          { key: 'semester', label: 'Sem' },
          { key: 'status', label: 'Status', render: (v) => (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              v === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            )}>{v}</span>
          )},
        ]}
        data={candidates}
        actions={(row) => (
          <>
            <button onClick={() => toggleStatus(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title={row.status === 'Active' ? 'Disable' : 'Enable'}>
              {row.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </button>
            <button onClick={() => resetPassword(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Reset Password">
              <KeyRound className="w-4 h-4" />
            </button>
            <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Candidate' : 'Add Candidate'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', required: true },
              { key: 'rollNumber', label: 'Roll Number', required: true },
              { key: 'regNumber', label: 'Registration Number', required: true },
              { key: 'email', label: 'Email', type: 'email', required: true },
              { key: 'phone', label: 'Phone', type: 'tel' },
              { key: 'branch', label: 'Branch' },
              { key: 'department', label: 'Department' },
              { key: 'semester', label: 'Semester' },
              { key: 'section', label: 'Section' },
              { key: 'password', label: 'Password', type: 'password', required: !editing },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  value={form[field.key] || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Candidate"
        message="Are you sure you want to delete this candidate? This action cannot be undone."
      />
    </div>
  );
}
