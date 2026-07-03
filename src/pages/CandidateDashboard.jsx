import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from '../components/StatCard';
import { cn } from '../utils/cn';

export function CandidateDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Assigned Tests', value: 3, icon: BookOpen, color: 'blue' },
    { title: 'Completed', value: 1, icon: CheckCircle, color: 'green' },
    { title: 'Upcoming', value: 1, icon: Clock, color: 'yellow' },
    { title: 'Average Score', value: '75%', icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.firstName || 'Student'}</h1>
        <p className="text-sm text-gray-500 mt-1">Here's your examination overview</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Python Basics</p>
                <p className="text-xs text-gray-500">Completed on 10 Jul 2026</p>
              </div>
              <span className="ml-auto text-sm font-bold text-green-600">60%</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Web Development</p>
                <p className="text-xs text-gray-500">Scheduled for 15 Jul 2026</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Course Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Python Programming</span>
                <span className="font-medium text-gray-900 dark:text-white">4/10 Units</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Web Development</span>
                <span className="font-medium text-gray-900 dark:text-white">2/8 Units</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
