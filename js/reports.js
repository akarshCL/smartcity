import { state, trafficSummary } from './state.js';
import { on, Events } from './eventBus.js';
import { addLogEntry } from './activityLog.js';
import { showToast } from './notify.js';

let summaryEl, exportBtn;

export function initReports() {
  summaryEl = document.getElementById('reportsSummary');
  exportBtn = document.getElementById('exportLogBtn');

  exportBtn.addEventListener('click', exportActivityLogCsv);

  [Events.TRAFFIC_CHANGED, Events.ENERGY_CHANGED, Events.ENVIRONMENT_CHANGED, Events.EMERGENCY_CHANGED, Events.WATER_CHANGED]
    .forEach((evt) => on(evt, render));

  render();
}

function render() {
  const t = trafficSummary();
  summaryEl.innerHTML = `
    <div class="stat"><div class="stat-label">CITY HEALTH SCORE</div><div class="stat-val">${state.healthScore} / 100</div></div>
    <div class="stat"><div class="stat-label">CITY STATUS</div><div class="stat-val">${state.cityStatus}</div></div>
    <div class="stat"><div class="stat-label">ACTIVE INCIDENTS</div><div class="stat-val">${state.emergencies.length}</div></div>
    <div class="stat"><div class="stat-label">CONGESTED ROADS</div><div class="stat-val">${t.high}</div></div>
    <div class="stat"><div class="stat-label">ENERGY LOAD</div><div class="stat-val">${state.energy.current.toFixed(2)} MW</div></div>
    <div class="stat"><div class="stat-label">AIR QUALITY</div><div class="stat-val">${state.environment.aqi} AQI</div></div>
  `;
}

function exportActivityLogCsv() {
  if (!state.activityLog.length) {
    showToast('No activity to export yet.', 'warning');
    return;
  }
  const rows = [['Time', 'Event'], ...state.activityLog.map((e) => [e.time, e.text])];
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nova-city-activity-log-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  addLogEntry('Exported activity log as CSV');
  showToast('Activity log exported.', 'success');
}
