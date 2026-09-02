import { state } from './state.js';
import { on, Events } from './eventBus.js';
import { addLogEntry } from './activityLog.js';

let statsEl, listEl, filterRow;

export function initTransport() {
  statsEl = document.getElementById('transportStats');
  listEl = document.getElementById('transportList');
  filterRow = document.getElementById('transportFilterRow');

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filterRow.querySelectorAll('.filter-pill').forEach((p) => p.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    state.filters.transport = btn.dataset.filter;
    addLogEntry(`Transport filter changed to ${btn.dataset.filter.toUpperCase()}`);
    renderList();
  });

  on(Events.TRANSPORT_CHANGED, () => {
    renderStats();
    renderList();
  });

  renderStats();
  renderList();
}

function renderStats() {
  const vehicles = state.transport;
  const buses = vehicles.filter((v) => v.mode === 'Bus').length;
  const metros = vehicles.filter((v) => v.mode === 'Metro').length;
  const delayed = vehicles.filter((v) => v.status === 'delayed').length;
  const onTimePct = Math.round(((vehicles.length - delayed) / vehicles.length) * 100);

  statsEl.innerHTML = `
    <div class="stat"><div class="stat-label">BUSES ACTIVE</div><div class="stat-val">${buses}</div></div>
    <div class="stat"><div class="stat-label">METRO TRAINS</div><div class="stat-val">${metros}</div></div>
    <div class="stat"><div class="stat-label">DELAYED VEHICLES</div><div class="stat-val">${delayed}</div></div>
    <div class="stat"><div class="stat-label">ON TIME</div><div class="stat-val">${onTimePct}%</div></div>
  `;
}

function renderList() {
  const filter = state.filters.transport.toLowerCase();
  const items = state.transport.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'delayed') return v.status === 'delayed';
    return v.mode.toLowerCase() === filter;
  });

  listEl.innerHTML =
    items
      .map(
        (v) => `
      <div class="list-row">
        <div class="row-main">
          <div class="row-title">${v.id.replace('-', ' ')}</div>
          <div class="row-sub">${v.route}</div>
        </div>
        <span class="pill-status" data-state="${v.status}">${v.statusText}</span>
      </div>`
      )
      .join('') || '<div class="empty-state">No vehicles match this filter.</div>';
}
