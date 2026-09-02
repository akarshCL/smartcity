import { state } from './state.js';
import { timeAgo, nextId } from './utils.js';
import { emit, on, Events } from './eventBus.js';

let listEl, bellPing, markReadBtn;

export function initAlerts() {
  listEl = document.getElementById('alertsList');
  bellPing = document.getElementById('bellPing');
  markReadBtn = document.getElementById('markAllReadBtn');

  markReadBtn.addEventListener('click', () => {
    state.alerts.forEach((a) => (a.read = true));
    renderAlerts();
    emit(Events.ALERTS_CHANGED);
  });

  document.getElementById('bellBtn').addEventListener('click', () => {
    document.querySelector('.nav-item[data-page="dashboard"]')?.click();
    listEl.closest('.panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  on(Events.ALERTS_CHANGED, renderAlerts);
  renderAlerts();
}

export function pushAlert(icon, text, kind = 'info') {
  state.alerts.unshift({ id: nextId('AL'), icon, text, time: Date.now(), read: false });
  if (state.alerts.length > 25) state.alerts.length = 25;
  renderAlerts();
}

export function renderAlerts() {
  if (!listEl) return;
  listEl.innerHTML = state.alerts
    .map(
      (a) => `
      <div class="alert-row ${a.read ? 'is-read' : ''}">
        <span class="alert-icon">${a.icon}</span>
        <div class="row-main">
          <div class="alert-text">${a.text}</div>
          <div class="alert-time mono">${timeAgo(a.time)}</div>
        </div>
      </div>`
    )
    .join('') || '<div class="empty-state">No alerts.</div>';

  const unread = state.alerts.filter((a) => !a.read).length;
  bellPing.style.display = unread > 0 ? 'block' : 'none';
}
