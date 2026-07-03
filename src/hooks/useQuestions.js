import { useState, useEffect, useCallback } from 'react';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../services/gasService';
import toast from 'react-hot-toast';

export function useQuestions(testId) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    try {
      const res = await getQuestions(testId);
      if (res.success) {
        setQuestions(res.data || []);
      } else {
        toast.error(res.error || 'Failed to fetch questions');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const addQuestion = async (data) => {
    try {
      const res = await createQuestion(data);
      if (res.success) {
        setQuestions(prev => [res.data, ...prev]);
        toast.success('Question added');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to add question');
      return false;
    }
  };

  const editQuestion = async (data) => {
    try {
      const res = await updateQuestion(data);
      if (res.success) {
        setQuestions(prev => prev.map(q => q.id === data.id ? res.data : q));
        toast.success('Question updated');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to update question');
      return false;
    }
  };

  const removeQuestion = async (id) => {
    try {
      const res = await deleteQuestion(id);
      if (res.success) {
        setQuestions(prev => prev.filter(q => q.id !== id));
        toast.success('Question deleted');
        return true;
      }
      toast.error(res.error);
      return false;
    } catch {
      toast.error('Failed to delete question');
      return false;
    }
  };

  return { questions, loading, fetchQuestions, addQuestion, editQuestion, removeQuestion };
}
