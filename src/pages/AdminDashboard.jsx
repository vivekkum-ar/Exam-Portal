import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Activity, Clock, CheckCircle, XCircle,
  TrendingUp, TrendingDown, Award, Calendar
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { formatDateTime } from '../utils/formatters';

export function AdminDashboard() {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of examination activities</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Candidates" value={stats?.totalCandidates} icon={Users} color="blue" delay={0} />
        <StatCard title="Total Tests" value={stats?.totalTests} icon={FileText} color="purple" delay={0.05} />
        <StatCard title="Active Tests" value={stats?.activeTests} icon={Activity} color="green" delay={0.1} />
        <StatCard title="Upcoming Tests" value={stats?.upcomingTests} icon={Calendar} color="yellow" delay={0.15} />
        <StatCard title="Completed Tests" value={stats?.completedTests} icon={CheckCircle} color="green" delay={0.2} />
        <StatCard title="Average Score" value={`${stats?.averageScore}%`} icon={TrendingUp} color="blue" delay={0.25} />
        <StatCard title="Highest Score" value={`${stats?.highestScore}%`} icon={Award} color="orange" delay={0.3} />
        <StatCard title="Lowest Score" value={`${stats?.lowestScore}%`} icon={TrendingDown} color="red" delay={0.35} />
      </div>

      {/* Pass/Fail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pass Rate</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-green-600 dark:text-green-400">{stats?.passPercentage}%</span>
            <span className="text-sm text-gray-500 mb-1">of candidates passed</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats?.passPercentage}%` }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Fail Rate</h3>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-red-600 dark:text-red-400">{stats?.failPercentage}%</span>
            <span className="text-sm text-gray-500 mb-1">of candidates failed</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats?.failPercentage}%` }} />
          </div>
        </motion.div>
      </div>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Submissions</h3>
        <DataTable
          columns={[
            { key: 'candidateName', label: 'Candidate' },
            { key: 'testName', label: 'Test' },
            { key: 'marks', label: 'Marks' },
            { key: 'percentage', label: '%', render: (v) => `${v}%` },
            { key: 'grade', label: 'Grade' },
            { key: 'submissionTime', label: 'Submitted', render: (v) => formatDateTime(v) },
          ]}
          data={stats?.recentSubmissions || []}
          pageSize={5}
          searchable={false}
        />
      </motion.div>
    </div>
  );
}
