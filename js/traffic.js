import { state, trafficSummary } from './state.js';
import { emit, on, Events } from './eventBus.js';
import { openModal } from './modal.js';
import { addLogEntry } from './activityLog.js';

let overviewEl, listEl, filterRow;

export function initTraffic() {
  overviewEl = document.getElementById('trafficOverview');
  listEl = document.getElementById('trafficList');
  filterRow = document.getElementById('trafficFilterRow');

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filterRow.querySelectorAll('.filter-pill').forEach((p) => p.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    state.filters.traffic = btn.dataset.filter;
    addLogEntry(`Traffic filter changed to ${btn.dataset.filter.toUpperCase()}`);
    renderTrafficList();
  });

  on(Events.TRAFFIC_CHANGED, () => {
    renderOverview();
    renderTrafficList();
  });

  renderOverview();
  renderTrafficList();
}

function renderOverview() {
  const s = trafficSummary();
  overviewEl.innerHTML = `
    <div class="bar-row"><span class="bar-label">High</span><div class="bar-track"><div class="bar-fill" data-level="high" style="width:${(s.high / state.roads.length) * 100}%"></div></div><span class="bar-pct mono">${s.high} Roads</span></div>
    <div class="bar-row"><span class="bar-label">Moderate</span><div class="bar-track"><div class="bar-fill" data-level="moderate" style="width:${(s.moderate / state.roads.length) * 100}%"></div></div><span class="bar-pct mono">${s.moderate} Roads</span></div>
    <div class="bar-row"><span class="bar-label">Normal</span><div class="bar-track"><div class="bar-fill" style="width:${(s.normal / state.roads.length) * 100}%"></div></div><span class="bar-pct mono">${s.normal} Roads</span></div>
  `;
}

function renderTrafficList() {
  const filter = state.filters.traffic.toLowerCase();
  const roads = state.roads.filter((r) => filter === 'all' || r.level === filter);
  listEl.innerHTML =
    roads
      .map(
        (r) => `
      <button class="bar-row road-row" data-road="${r.id}" style="width:100%; background:none; border:none; border-bottom:1px dashed var(--line); cursor:pointer;">
        <span class="bar-label">${r.label}</span>
        <div class="bar-track"><div class="bar-fill" data-level="${r.level === 'normal' ? '' : r.level}" style="width:${r.pct}%"></div></div>
        <span class="bar-pct mono">${r.pct}%</span>
      </button>`
      )
      .join('') || '<div class="empty-state">No roads match this filter.</div>';

  listEl.querySelectorAll('.road-row').forEach((row) => {
    row.addEventListener('click', () => showRoadDetail(row.dataset.road));
  });
}

export function showRoadDetail(roadId) {
  const road = state.roads.find((r) => r.id === roadId);
  if (!road) return;
  emit(Events.MAP_SELECT, { type: 'road', id: roadId });
  openModal(road.label, `
    <div class="modal-grid">
      <div><div class="mg-label">TRAFFIC LEVEL</div><div class="mg-val">${road.level.toUpperCase()}</div></div>
      <div><div class="mg-label">AVERAGE SPEED</div><div class="mg-val">${road.speed} km/h</div></div>
      <div><div class="mg-label">VEHICLES</div><div class="mg-val">${road.vph.toLocaleString()}/hour</div></div>
      <div><div class="mg-label">STATUS</div><div class="mg-val">${road.pct >= 70 ? 'Congested' : road.pct >= 40 ? 'Flowing' : 'Clear'}</div></div>
    </div>
  `);
}
