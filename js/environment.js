import { state } from './state.js';
import { on, Events } from './eventBus.js';

const RADIUS = 55;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let ringFg, numEl, statusEl, pollutantsEl, statsEl;

export function initEnvironment() {
  ringFg = document.getElementById('aqiRingFg');
  numEl = document.getElementById('aqiRingNum');
  statusEl = document.getElementById('aqiRingStatus');
  pollutantsEl = document.getElementById('pollutantList');
  statsEl = document.getElementById('envStats');

  ringFg.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;

  on(Events.ENVIRONMENT_CHANGED, render);
  render();
}

function statusForAqi(aqi) {
  if (aqi <= 50) return { text: 'Good', color: 'var(--signal-green)' };
  if (aqi <= 100) return { text: 'Moderate', color: 'var(--signal-amber)' };
  if (aqi <= 150) return { text: 'Unhealthy', color: 'var(--signal-red)' };
  return { text: 'Hazardous', color: 'var(--signal-red)' };
}

function render() {
  const env = state.environment;
  const { text, color } = statusForAqi(env.aqi);
  env.aqiStatus = text;

  const pct = Math.min(env.aqi / 200, 1);
  ringFg.style.strokeDashoffset = CIRCUMFERENCE - pct * CIRCUMFERENCE;
  ringFg.style.stroke = color;
  numEl.textContent = env.aqi;
  statusEl.textContent = text.toUpperCase();
  statusEl.style.color = color;

  pollutantsEl.innerHTML = `
    <div class="bar-row"><span class="bar-label">PM2.5</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(env.pm25, 100)}%"></div></div><span class="bar-pct mono">${env.pm25} µg/m³</span></div>
    <div class="bar-row"><span class="bar-label">PM10</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(env.pm10, 100)}%"></div></div><span class="bar-pct mono">${env.pm10} µg/m³</span></div>
    <div class="bar-row"><span class="bar-label">CO₂</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(env.co2 / 6, 100)}%"></div></div><span class="bar-pct mono">${env.co2} ppm</span></div>
    <div class="bar-row"><span class="bar-label">NO₂</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(env.no2 * 2, 100)}%"></div></div><span class="bar-pct mono">${env.no2} µg/m³</span></div>
  `;

  statsEl.innerHTML = `
    <div class="stat"><div class="stat-label">GREEN ZONES</div><div class="stat-val">${env.greenZones}</div></div>
    <div class="stat"><div class="stat-label">AIR SENSORS</div><div class="stat-val">${env.sensors}</div></div>
    <div class="stat"><div class="stat-label">HEALTHY ZONES</div><div class="stat-val">${env.healthyZonesPct}%</div></div>
  `;
}
