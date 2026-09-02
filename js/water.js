import { state } from './state.js';
import { on, Events } from './eventBus.js';

let gaugeFill, gaugeVal, gaugeStatus, zonesEl;

export function initWater() {
  gaugeFill = document.getElementById('waterGaugeFill');
  gaugeVal = document.getElementById('waterGaugeVal');
  gaugeStatus = document.getElementById('waterGaugeStatus');
  zonesEl = document.getElementById('waterZoneList');

  on(Events.WATER_CHANGED, render);
  render();
}

function render() {
  const w = state.water;
  gaugeFill.style.width = `${w.supplyPct}%`;
  gaugeFill.dataset.level = w.supplyPct < 40 ? 'high' : w.supplyPct < 70 ? 'moderate' : '';
  gaugeVal.textContent = `${w.supplyPct}%`;
  gaugeStatus.textContent = w.status;

  zonesEl.innerHTML = w.zones
    .map(
      (z) => `
      <div class="bar-row">
        <span class="bar-label">${z.name}</span>
        <div class="bar-track"><div class="bar-fill" data-level="${z.pct < 40 ? 'high' : z.pct < 70 ? 'moderate' : ''}" style="width:${z.pct}%"></div></div>
        <span class="bar-pct mono">${z.pct}%</span>
      </div>`
    )
    .join('');
}
