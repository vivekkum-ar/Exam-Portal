import { useState, useEffect, useCallback } from 'react';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../services/gasService';
import toast from 'react-hot-toast';

export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCandidates();
      if (res.success) {
        setCandidates(res.data || []);
      } else {
        toast.error(res.error || 'Failed to fetch candidates');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const addCandidate = async (data) => {
    try {
      const res = await createCandidate(data);
      if (res.success) {
        setCandidates(prev => [res.data, ...prev]);
        toast.success('Candidate created');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to create candidate');
      return false;
    }
  };

  const editCandidate = async (data) => {
    try {
      const res = await updateCandidate(data);
      if (res.success) {
        setCandidates(prev => prev.map(c => c.id === data.id ? res.data : c));
        toast.success('Candidate updated');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to update candidate');
      return false;
    }
  };

  const removeCandidate = async (id) => {
    try {
      const res = await deleteCandidate(id);
      if (res.success) {
        setCandidates(prev => prev.filter(c => c.id !== id));
        toast.success('Candidate deleted');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to delete candidate');
      return false;
    }
  };

  return { candidates, loading, fetchCandidates, addCandidate, editCandidate, removeCandidate };
}
