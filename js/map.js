import { state } from './state.js';
import { on, Events } from './eventBus.js';
import { openModal } from './modal.js';
import { showRoadDetail } from './traffic.js';
import { showIncidentDetail } from './emergency.js';

let svg;

const FACILITY_ICON = { hospital: '🏥', police: '🚓', fire: '🚒', power: '⚡', water: '💧', bus: '🚌' };

export function initMap() {
  svg = document.getElementById('cityMapSvg');
  renderStatic();
  renderSignals();
  renderEmergencyMarkers();

  on(Events.TRAFFIC_CHANGED, renderSignals);
  on(Events.EMERGENCY_CHANGED, renderEmergencyMarkers);
  on(Events.MAP_SELECT, ({ type, id }) => {
    if (type === 'road') highlightRoad(id);
  });
}

function buildingRects() {
  // Decorative city-block filler, deliberately avoiding the road corridors.
  const blocks = [];
  const zones = [
    [40, 40, 90, 60], [40, 160, 90, 40], [200, 40, 180, 60], [460, 40, 170, 60],
    [200, 260, 180, 40], [460, 260, 170, 40], [40, 360, 90, 60], [200, 360, 180, 40],
    [460, 360, 170, 40], [700, 40, 60, 60], [700, 160, 60, 40], [700, 260, 60, 40], [700, 360, 60, 40],
  ];
  zones.forEach(([x, y, w, h], i) => {
    const cols = Math.max(1, Math.floor(w / 42));
    const rows = Math.max(1, Math.floor(h / 30));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const bw = w / cols - 4, bh = h / rows - 4;
        const bx = x + c * (w / cols) + 2, by = y + r * (h / rows) + 2;
        blocks.push(`<rect class="map-building" x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2"/>`);
      }
    }
  });
  return blocks.join('');
}

function renderStatic() {
  const roadsMarkup = state.roads
    .map(
      (r) => `
      <g>
        <path class="map-road" d="${r.path}"/>
        <path class="map-road-lane" d="${r.path}"/>
        <path class="map-road-hit" data-road="${r.id}" d="${r.path}" stroke="transparent" stroke-width="22" fill="none" style="cursor:pointer;" tabindex="0" role="button" aria-label="${r.label}"/>
      </g>`
    )
    .join('');

  const facilitiesMarkup = state.facilities
    .map(
      (f) => `
      <g class="map-marker ${f.type}" data-facility="${f.id}" tabindex="0" role="button" aria-label="${f.name}" transform="translate(${f.x},${f.y})">
        <circle class="marker-ring" r="10"/>
        <circle class="marker-core" r="7"/>
        <text x="0" y="-14" text-anchor="middle" font-size="14">${FACILITY_ICON[f.type] || '📍'}</text>
      </g>`
    )
    .join('');

  svg.innerHTML = `
    <g class="map-buildings">${buildingRects()}</g>
    <g class="map-roads">${roadsMarkup}</g>
    <g class="map-facilities">${facilitiesMarkup}</g>
    <g class="map-signals"></g>
    <g class="map-emergencies"></g>
  `;

  svg.querySelectorAll('.map-road-hit').forEach((el) => {
    const activate = () => showRoadDetail(el.dataset.road);
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate(); });
  });
  svg.querySelectorAll('.map-facilities .map-marker').forEach((el) => {
    const activate = () => showFacilityDetail(el.dataset.facility);
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate(); });
  });
}

function renderSignals() {
  const group = svg.querySelector('.map-signals');
  if (!group) return;
  group.innerHTML = state.signals
    .map((s, i) => {
      const road = state.roads[i % state.roads.length];
      const level = road ? road.level : s.level;
      return `<g class="map-marker signal ${level}" transform="translate(${s.x},${s.y})"><circle class="marker-core" r="5"/></g>`;
    })
    .join('');
}

function renderEmergencyMarkers() {
  const group = svg.querySelector('.map-emergencies');
  if (!group) return;
  group.innerHTML = state.emergencies
    .map(
      (e) => `
      <g class="map-marker emergency" data-emergency="${e.id}" tabindex="0" role="button" aria-label="${e.type} at ${e.location}" transform="translate(${e.x},${e.y})">
        <circle class="marker-ring" r="10"/>
        <circle class="marker-core" r="7"/>
        <text x="0" y="-14" text-anchor="middle" font-size="13">${e.icon}</text>
      </g>`
    )
    .join('');

  group.querySelectorAll('.map-marker').forEach((el) => {
    const activate = () => showIncidentDetail(Number(el.dataset.emergency));
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate(); });
  });
}

function highlightRoad(roadId) {
  svg.querySelectorAll('.map-road').forEach((el) => el.classList.remove('selected'));
  const hit = svg.querySelector(`.map-road-hit[data-road="${roadId}"]`);
  if (hit) hit.previousElementSibling?.previousElementSibling?.classList.add('selected');
}

export function showFacilityDetail(facilityId) {
  const f = state.facilities.find((x) => x.id === facilityId);
  if (!f) return;
  const rows = Object.entries(f.info)
    .map(([label, val]) => `<div><div class="mg-label">${label.toUpperCase()}</div><div class="mg-val">${val}</div></div>`)
    .join('');
  openModal(f.name.toUpperCase(), `<div class="modal-grid">${rows}</div>`);
}
