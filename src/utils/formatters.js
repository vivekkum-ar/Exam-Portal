export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '-';
  return timeStr;
}

export function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T' + (timeStr || '00:00'));
  return d.toLocaleString('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function formatDuration(minutes) {
  if (!minutes) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
}

export function getGradeColor(grade) {
  const colors = {
    'A+': 'text-green-600 dark:text-green-400',
    'A': 'text-green-500 dark:text-green-400',
    'B': 'text-blue-500 dark:text-blue-400',
    'C': 'text-yellow-500 dark:text-yellow-400',
    'D': 'text-orange-500 dark:text-orange-400',
    'E': 'text-red-400 dark:text-red-400',
    'F': 'text-red-600 dark:text-red-500',
  };
  return colors[grade] || 'text-gray-500';
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
