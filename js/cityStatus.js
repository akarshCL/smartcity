import { state, trafficSummary } from './state.js';
import { addLogEntry } from './activityLog.js';

let chipEl, labelEl;

export function initCityStatus() {
  chipEl = document.getElementById('cityStatusChip');
  labelEl = document.getElementById('cityStatusLabel');
  updateCityStatus();
}

export function updateCityStatus() {
  const traffic = trafficSummary();
  const criticalIncidents = state.emergencies.filter((e) => e.severity === 'Critical').length;
  const highIncidents = state.emergencies.length;
  const aqi = state.environment.aqi;

  let level = 'normal';
  if (criticalIncidents >= 2 || aqi > 150 || traffic.high >= 5) {
    level = 'critical';
  } else if (criticalIncidents >= 1 || aqi > 100 || traffic.high >= 3 || highIncidents >= 4) {
    level = 'warning';
  }

  const prev = state.cityStatus;
  const labelMap = { normal: 'NORMAL', warning: 'WARNING', critical: 'CRITICAL' };
  state.cityStatus = labelMap[level];

  chipEl.dataset.level = level;
  labelEl.textContent = `CITY STATUS: ${state.cityStatus}`;

  if (prev !== state.cityStatus) {
    addLogEntry(`City status changed to ${state.cityStatus}`);
  }
  return state.cityStatus;
}
