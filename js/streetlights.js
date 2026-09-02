import { state } from './state.js';
import { emit, Events } from './eventBus.js';
import { saveState } from './storage.js';
import { showToast } from './notify.js';
import { addLogEntry } from './activityLog.js';
import { adjustEnergyLoad } from './energy.js';

let listEl, activeCountEl;

export function initStreetlights() {
  listEl = document.getElementById('streetlightList');
  activeCountEl = document.getElementById('streetlightActiveCount');
  render();
}

function render() {
  const active = state.streetlights.filter((l) => l.on).length;
  activeCountEl.textContent = `${active} / ${state.streetlights.length} active`;

  listEl.innerHTML = state.streetlights
    .map(
      (l) => `
      <div class="list-row">
        <div class="row-main">
          <div class="row-title">${l.name}</div>
          <div class="row-sub">${l.wattage.toFixed(1)} kW draw</div>
        </div>
        <label class="switch">
          <input type="checkbox" data-light="${l.id}" ${l.on ? 'checked' : ''} aria-label="Toggle ${l.name}">
          <span class="track"></span>
          <span class="thumb"></span>
        </label>
      </div>`
    )
    .join('');

  listEl.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', () => toggleLight(input.dataset.light, input.checked));
  });
}

function toggleLight(id, on) {
  const light = state.streetlights.find((l) => l.id === id);
  if (!light) return;
  light.on = on;
  saveState('streetlights', state.streetlights);

  const deltaMW = (on ? 1 : -1) * (light.wattage / 1000) * 3;
  adjustEnergyLoad(deltaMW);

  const reduction = Math.abs(Math.round((light.wattage / 30) * 10));
  showToast(
    `Street light updated successfully. Energy consumption ${on ? 'increased' : 'reduced'} by ${reduction}%.`,
    on ? 'info' : 'success'
  );
  addLogEntry(`Street light #${id} switched ${on ? 'ON' : 'OFF'}`);

  render();
  emit(Events.LIGHTS_CHANGED);
}
