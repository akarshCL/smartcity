import { state } from './state.js';
import { emit, Events, on } from './eventBus.js';
import { openModal, closeModal } from './modal.js';
import { showToast } from './notify.js';
import { addLogEntry } from './activityLog.js';
import { pushAlert } from './alerts.js';
import { timeAgo } from './utils.js';
import { saveState, loadState } from './storage.js';

let listEl, filterRow, simulateBtn;

const TYPE_ICON = { Fire: '🔥', Medical: '🚑', Accident: '🚔', Hazard: '☣️', Flood: '🌊' };
let nextIncidentId = 2051;

export function initEmergency() {
  listEl = document.getElementById('emergencyList');
  filterRow = document.getElementById('emergencyFilterRow');
  simulateBtn = document.getElementById('simulateEmergencyBtn');

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filterRow.querySelectorAll('.filter-pill').forEach((p) => p.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    state.filters.emergency = btn.dataset.filter;
    render();
  });

  simulateBtn.addEventListener('click', openSimulateForm);

  on(Events.EMERGENCY_CHANGED, render);
  render();
}

function severityMatches(filter, severity) {
  if (filter === 'all') return true;
  return severity.toLowerCase() === filter;
}

function render() {
  const filter = state.filters.emergency.toLowerCase();
  const incidents = [...state.emergencies].sort((a, b) => b.time - a.time);
  const visible = incidents.filter((i) => severityMatches(filter, i.severity));

  listEl.innerHTML =
    visible
      .map(
        (inc) => `
      <div class="incident-card" data-id="${inc.id}" tabindex="0" role="button" aria-label="View incident ${inc.id}">
        <div class="inc-icon">${inc.icon}</div>
        <div class="inc-body">
          <div class="inc-type">${inc.type}</div>
          <div class="inc-loc">${inc.location}</div>
          <div class="inc-time">${timeAgo(inc.time)}</div>
        </div>
        <span class="sev-badge" data-sev="${inc.severity}">${inc.severity.toUpperCase()}</span>
      </div>`
      )
      .join('') || '<div class="empty-state">No active incidents. City is clear.</div>';

  const badge = document.getElementById('navEmergencyBadge');
  if (badge) {
    badge.textContent = incidents.length;
    badge.style.display = incidents.length > 0 ? 'inline-block' : 'none';
  }

  listEl.querySelectorAll('.incident-card').forEach((card) => {
    const open = () => showIncidentDetail(Number(card.dataset.id));
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

export function showIncidentDetail(id) {
  const inc = state.emergencies.find((e) => e.id === id);
  if (!inc) return;
  emit(Events.MAP_SELECT, { type: 'emergency', id });

  openModal(`INCIDENT #${inc.id}`, `
    <div class="modal-grid">
      <div><div class="mg-label">TYPE</div><div class="mg-val">${inc.type}</div></div>
      <div><div class="mg-label">LOCATION</div><div class="mg-val">${inc.location}</div></div>
      <div><div class="mg-label">RESPONSE UNIT</div><div class="mg-val">${inc.unit}</div></div>
      <div><div class="mg-label">ETA</div><div class="mg-val">${inc.eta}</div></div>
      <div><div class="mg-label">SEVERITY</div><div class="mg-val">${inc.severity}</div></div>
      <div><div class="mg-label">STATUS</div><div class="mg-val">${inc.status}</div></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" id="dispatchBtn">Dispatch</button>
      <button class="btn btn-danger" id="resolveBtn">Resolve</button>
      <button class="btn btn-ghost" id="detailsBtn">View Details</button>
    </div>
  `);

  document.getElementById('dispatchBtn').addEventListener('click', () => dispatchIncident(id));
  document.getElementById('resolveBtn').addEventListener('click', () => resolveIncident(id));
  document.getElementById('detailsBtn').addEventListener('click', () => {
    showToast(`Unit ${inc.unit} is ${inc.status.toLowerCase()} — ETA ${inc.eta}.`, 'info');
  });
}

function dispatchIncident(id) {
  const inc = state.emergencies.find((e) => e.id === id);
  if (!inc) return;
  inc.status = 'Responding';
  addLogEntry(`Dispatched unit to Incident #${id}`);
  pushAlert('🚨', `Emergency unit dispatched to ${inc.location}`, 'warning');
  showToast('Unit dispatched.', 'success');
  closeModal();
  emit(Events.EMERGENCY_CHANGED);
}

function resolveIncident(id) {
  state.emergencies = state.emergencies.filter((e) => e.id !== id);
  const resolved = loadState('resolvedIncidents', []);
  resolved.push(id);
  saveState('resolvedIncidents', resolved.slice(-50));
  addLogEntry(`Resolved Emergency #${id}`);
  showToast('✓ Incident resolved', 'success');
  closeModal();
  emit(Events.EMERGENCY_CHANGED);
}

function openSimulateForm() {
  openModal('SIMULATE EMERGENCY', `
    <form id="simulateForm">
      <div class="field">
        <label for="simType">Emergency Type</label>
        <select id="simType">
          <option>Fire</option>
          <option>Medical</option>
          <option>Accident</option>
          <option>Hazard</option>
          <option>Flood</option>
        </select>
      </div>
      <div class="field">
        <label for="simLocation">Location</label>
        <input id="simLocation" type="text" placeholder="e.g. Riverside District" required>
      </div>
      <div class="field">
        <label for="simSeverity">Severity</label>
        <select id="simSeverity">
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">Report Emergency</button>
        <button type="button" class="btn btn-ghost" id="cancelSimBtn">Cancel</button>
      </div>
    </form>
  `);

  document.getElementById('cancelSimBtn').addEventListener('click', closeModal);
  document.getElementById('simulateForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('simType').value;
    const location = document.getElementById('simLocation').value.trim() || 'Unknown Sector';
    const severity = document.getElementById('simSeverity').value;
    addSimulatedEmergency(type, location, severity);
    closeModal();
  });
}

function addSimulatedEmergency(type, location, severity) {
  const id = nextIncidentId++;
  const incident = {
    id, type, icon: TYPE_ICON[type] || '⚠️', location,
    x: 80 + Math.random() * 640, y: 60 + Math.random() * 340,
    time: Date.now(), severity,
    unit: type === 'Fire' ? 'Fire Unit 03' : type === 'Medical' ? 'Ambulance 07' : 'Patrol 09',
    eta: `0${Math.ceil(Math.random() * 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    status: 'Dispatched',
  };
  state.emergencies.unshift(incident);
  addLogEntry(`New ${severity} ${type} incident reported — ${location}`);
  pushAlert('🚨', `New ${type.toLowerCase()} emergency reported in ${location}`, severity === 'Critical' ? 'critical' : 'warning');
  showToast(`🚨 New emergency reported in ${location}`, severity === 'Critical' ? 'critical' : 'warning');
  emit(Events.EMERGENCY_CHANGED);
}