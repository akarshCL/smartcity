import { state, trafficSummary } from './state.js';
import { clamp } from './utils.js';

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ENERGY_CAPACITY_MW = 3.0;

let ringFg, numEl, subBarsEl;

export function initHealthScore() {
  ringFg = document.getElementById('healthRingFg');
  numEl = document.getElementById('healthScoreNum');
  subBarsEl = document.getElementById('healthSubBars');
  ringFg.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
  updateHealthScore();
}

function computeSubScores() {
  const roads = state.roads;
  const avgPct = roads.reduce((sum, r) => sum + r.pct, 0) / roads.length;
  const traffic = clamp(Math.round(100 - avgPct * 0.5), 0, 100);

  const aqi = state.environment.aqi;
  const environment = clamp(Math.round(130 - aqi * 0.6), 0, 100);

  const usagePct = clamp((state.energy.current / ENERGY_CAPACITY_MW) * 100, 0, 100);
  const energy = clamp(Math.round(100 - usagePct * 0.15), 0, 100);

  const weights = { Critical: 6, High: 4, Medium: 2 };
  const penalty = state.emergencies.reduce((sum, e) => sum + (weights[e.severity] || 2), 0);
  const safety = clamp(Math.round(100 - penalty), 0, 100);

  const water = clamp(Math.round(state.water.supplyPct), 0, 100);

  return { Traffic: traffic, Environment: environment, Energy: energy, Safety: safety, Water: water };
}

export function updateHealthScore() {
  const scores = computeSubScores();
  const values = Object.values(scores);
  const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  state.healthScore = overall;

  const offset = CIRCUMFERENCE - (overall / 100) * CIRCUMFERENCE;
  ringFg.style.strokeDashoffset = offset;
  ringFg.style.stroke = overall >= 75 ? 'var(--signal-teal)' : overall >= 50 ? 'var(--signal-amber)' : 'var(--signal-red)';
  numEl.textContent = overall;

  subBarsEl.innerHTML = Object.entries(scores)
    .map(
      ([label, val]) => `
      <div class="bar-row">
        <span class="bar-label">${label}</span>
        <div class="bar-track"><div class="bar-fill" data-level="${val < 60 ? 'high' : val < 80 ? 'moderate' : ''}" style="width:${val}%"></div></div>
        <span class="bar-pct mono">${val}</span>
      </div>`
    )
    .join('');

  return overall;
}
