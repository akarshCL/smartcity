import { state } from './state.js';
import { formatClockTime } from './utils.js';

const MAX_ENTRIES = 30;
let listEl;

export function initActivityLog() {
  listEl = document.getElementById('activityLogList');
  addLogEntry('Dashboard initialized');
}

export function addLogEntry(text) {
  state.activityLog.unshift({ time: formatClockTime(new Date()), text });
  if (state.activityLog.length > MAX_ENTRIES) state.activityLog.length = MAX_ENTRIES;
  renderActivityLog();
}

export function renderActivityLog() {
  if (!listEl) return;
  listEl.innerHTML = state.activityLog
    .map((e) => `<div class="log-item"><span class="log-time mono">${e.time}</span><span class="log-text">${e.text}</span></div>`)
    .join('') || '<div class="empty-state">No operator activity yet.</div>';
}
