import { state } from './state.js';
import { emit, on, Events } from './eventBus.js';
import { addLogEntry } from './activityLog.js';

let chartEl, axisEl, statStripEl, rangeRow;

const RANGE_LABELS = {
  '24h': (i, n) => `${i}h`,
  '7d': (i, n) => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i] || i,
  '30d': (i, n) => (i % 5 === 0 ? `D${i + 1}` : ''),
};

export function initEnergy() {
  chartEl = document.getElementById('energyChart');
  axisEl = document.getElementById('energyChartAxis');
  statStripEl = document.getElementById('energyStatStrip');
  rangeRow = document.getElementById('energyRangeRow');

  rangeRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    rangeRow.querySelectorAll('.filter-pill').forEach((p) => p.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    state.energyRange = btn.dataset.range;
    renderChart();
  });

  on(Events.ENERGY_CHANGED, () => {
    renderStats();
    renderChart();
  });

  renderStats();
  renderChart();
}

function renderStats() {
  statStripEl.innerHTML = `
    <div class="stat"><div class="stat-label">CURRENT USAGE</div><div class="stat-val">${state.energy.current.toFixed(2)} MW</div></div>
    <div class="stat"><div class="stat-label">TODAY'S CONSUMPTION</div><div class="stat-val">${state.energy.todayMWh.toFixed(1)} MWh</div></div>
    <div class="stat"><div class="stat-label">SOLAR CONTRIBUTION</div><div class="stat-val">${state.energy.solarPct}%</div></div>
    <div class="stat"><div class="stat-label">GRID CONTRIBUTION</div><div class="stat-val">${state.energy.gridPct}%</div></div>
  `;
}

function renderChart() {
  const series = state.energy.history[state.energyRange];
  const max = Math.max(...series, 1);
  const labelFn = RANGE_LABELS[state.energyRange];

  chartEl.innerHTML = series
    .map((v, i) => `<div class="energy-bar" style="height:${(v / max) * 100}%" data-val="${v} MWh" title="${v} MWh"></div>`)
    .join('');
  axisEl.innerHTML = series.map((_, i) => `<span>${labelFn(i, series.length)}</span>`).join('');
}

/** Called by streetlights.js when a light is toggled — keeps energy KPI truthfully connected. */
export function adjustEnergyLoad(deltaMW) {
  state.energy.current = Math.max(0.2, +(state.energy.current + deltaMW).toFixed(2));
  emit(Events.ENERGY_CHANGED);
}
