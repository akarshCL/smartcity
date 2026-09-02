import { saveState, loadState, clearAll } from './storage.js';
import { showToast } from './notify.js';
import { addLogEntry } from './activityLog.js';

export function initSettings() {
  const notifToggle = document.getElementById('settingsNotifToggle');
  const resetBtn = document.getElementById('resetDataBtn');
  const settingsThemeBtn = document.getElementById('settingsThemeToggleBtn');

  notifToggle.checked = loadState('notifPref', true);
  notifToggle.addEventListener('change', () => {
    saveState('notifPref', notifToggle.checked);
    showToast(`Toast notifications ${notifToggle.checked ? 'enabled' : 'disabled'}.`, 'info');
    addLogEntry(`Notification preference set to ${notifToggle.checked ? 'ON' : 'OFF'}`);
  });

  settingsThemeBtn.addEventListener('click', () => {
    document.getElementById('themeToggleBtn').click();
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset all saved dashboard preferences and reload? This clears theme, street light states, and resolved incidents.')) return;
    clearAll();
    window.location.reload();
  });
}
