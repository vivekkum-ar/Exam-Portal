import { useState, useEffect, useCallback } from 'react';
import { getTests, createTest, updateTest, deleteTest } from '../services/gasService';
import toast from 'react-hot-toast';

export function useTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTests();
      if (res.success) {
        setTests(res.data || []);
      } else {
        toast.error(res.error || 'Failed to fetch tests');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const addTest = async (data) => {
    try {
      const res = await createTest(data);
      if (res.success) {
        setTests(prev => [res.data, ...prev]);
        toast.success('Test created');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to create test');
      return false;
    }
  };

  const editTest = async (data) => {
    try {
      const res = await updateTest(data);
      if (res.success) {
        setTests(prev => prev.map(t => t.id === data.id ? res.data : t));
        toast.success('Test updated');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to update test');
      return false;
    }
  };

  const removeTest = async (id) => {
    try {
      const res = await deleteTest(id);
      if (res.success) {
        setTests(prev => prev.filter(t => t.id !== id));
        toast.success('Test deleted');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to delete test');
      return false;
    }
  };

  return { tests, loading, fetchTests, addTest, editTest, removeTest };
}
