import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { INSTITUTE } from '../config/config';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    instituteName: INSTITUTE.name,
    passingPercentage: 40,
    defaultDuration: 60,
    defaultNegativeMarking: 0,
    emailNotifications: true,
    autoSubmit: true,
    showResults: true,
    allowRetake: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure examination portal settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Institute Settings</h3>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Institute Name</label>
            <input value={settings.instituteName} onChange={e => setSettings(p => ({ ...p, instituteName: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Logo URL</label>
            <input placeholder="https://example.com/logo.png" className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Default Test Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Passing %</label>
              <input type="number" min="0" max="100" value={settings.passingPercentage} onChange={e => setSettings(p => ({ ...p, passingPercentage: parseInt(e.target.value) }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Duration (min)</label>
              <input type="number" min="1" value={settings.defaultDuration} onChange={e => setSettings(p => ({ ...p, defaultDuration: parseInt(e.target.value) }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Negative Marking</label>
            <input type="number" step="0.25" min="0" value={settings.defaultNegativeMarking} onChange={e => setSettings(p => ({ ...p, defaultNegativeMarking: parseFloat(e.target.value) }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Examination Rules</h3>
          {[
            { key: 'emailNotifications', label: 'Email Notifications' },
            { key: 'autoSubmit', label: 'Auto Submit on Timeout' },
            { key: 'showResults', label: 'Show Results Immediately' },
            { key: 'allowRetake', label: 'Allow Retake' },
          ].map(opt => (
            <label key={opt.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
              <input type="checkbox" checked={settings[opt.key]} onChange={e => setSettings(p => ({ ...p, [opt.key]: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className={cn(
          'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium',
          'bg-primary-600 text-white hover:bg-primary-700 transition-colors'
        )}>
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
