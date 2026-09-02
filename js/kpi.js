import { state, trafficSummary } from './state.js';
import { on, Events } from './eventBus.js';
import { animateCount, clamp } from './utils.js';

const ENERGY_CAPACITY_MW = 3.0;
let els = {};

export function initKpi() {
  els = {
    temp: document.getElementById('kpiTempValue'),
    tempMeta: document.getElementById('kpiTempMeta'),
    aqi: document.getElementById('kpiAqiValue'),
    aqiMeta: document.getElementById('kpiAqiMeta'),
    traffic: document.getElementById('kpiTrafficValue'),
    trafficMeta: document.getElementById('kpiTrafficMeta'),
    energy: document.getElementById('kpiEnergyValue'),
    energyMeta: document.getElementById('kpiEnergyMeta'),
    water: document.getElementById('kpiWaterValue'),
    waterMeta: document.getElementById('kpiWaterMeta'),
    incidents: document.getElementById('kpiIncidentsValue'),
    incidentsMeta: document.getElementById('kpiIncidentsMeta'),
    incidentsCard: document.getElementById('kpiIncidentsCard'),
  };

  on(Events.TRAFFIC_CHANGED, renderTraffic);
  on(Events.ENERGY_CHANGED, renderEnergy);
  on(Events.ENVIRONMENT_CHANGED, renderEnvironment);
  on(Events.EMERGENCY_CHANGED, renderEmergency);
  on(Events.WATER_CHANGED, renderWater);
  on(Events.WEATHER_CHANGED, renderTemperature);

  renderAll();
}

export function renderAll() {
  renderTemperature();
  renderEnvironment();
  renderTraffic();
  renderEnergy();
  renderWater();
  renderEmergency();
}

function renderTemperature() {
  animateCount(els.temp, state.temperature.value, { decimals: 0, suffix: '°C' });
  els.tempMeta.textContent = `Feels like ${Math.round(state.temperature.feelsLike)}°C`;
}

function renderEnvironment() {
  animateCount(els.aqi, state.environment.aqi, { decimals: 0, suffix: ' AQI' });
  els.aqiMeta.textContent = state.environment.aqiStatus;
}

function renderTraffic() {
  const roads = state.roads;
  const avgPct = Math.round(roads.reduce((s, r) => s + r.pct, 0) / roads.length);
  const label = avgPct >= 70 ? 'High' : avgPct >= 40 ? 'Moderate' : 'Normal';
  animateCount(els.traffic, avgPct, { decimals: 0, suffix: '%' });
  els.trafficMeta.textContent = label;
}

function renderEnergy() {
  const usagePct = clamp(Math.round((state.energy.current / ENERGY_CAPACITY_MW) * 100), 0, 100);
  animateCount(els.energy, usagePct, { decimals: 0, suffix: '%' });
  els.energyMeta.textContent = `${state.energy.current.toFixed(2)} MW`;
}

function renderWater() {
  animateCount(els.water, state.water.supplyPct, { decimals: 0, suffix: '%' });
  els.waterMeta.textContent = state.water.status;
}

function renderEmergency() {
  const count = state.emergencies.length;
  const critical = state.emergencies.filter((e) => e.severity === 'Critical').length;
  animateCount(els.incidents, count, { decimals: 0 });
  els.incidentsMeta.textContent = critical > 0 ? `${critical} Critical` : 'All Stable';
  els.incidentsCard.dataset.tone = critical > 0 ? 'critical' : 'normal';
}
