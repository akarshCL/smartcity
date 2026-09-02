import { on, Events } from './eventBus.js';
import { initTheme } from './theme.js';
import { initClock } from './clock.js';
import { initSidebar } from './sidebar.js';
import { initModal } from './modal.js';
import { initNotify, showToast } from './notify.js';
import { initActivityLog, addLogEntry } from './activityLog.js';
import { initAlerts } from './alerts.js';
import { initKpi, renderAll as renderAllKpis } from './kpi.js';
import { initMap } from './map.js';
import { initTraffic } from './traffic.js';
import { initEnergy } from './energy.js';
import { initEnvironment } from './environment.js';
import { initWater } from './water.js';
import { initWeather } from './weather.js';
import { initEmergency } from './emergency.js';
import { initTransport } from './transport.js';
import { initStreetlights } from './streetlights.js';
import { initCityStatus, updateCityStatus } from './cityStatus.js';
import { initHealthScore, updateHealthScore } from './healthScore.js';
import { initSearch } from './search.js';
import { initReports } from './reports.js';
import { initSettings } from './settings.js';
import { startSimulation } from './simulate.js';

function initializeDashboard() {
  initModal();
  initNotify();
  initTheme();
  initClock();
  initSidebar();
  initActivityLog();
  initAlerts();

  initKpi();
  initMap();
  initTraffic();
  initEnergy();
  initEnvironment();
  initWater();
  initWeather();
  initEmergency();
  initTransport();
  initStreetlights();
  initCityStatus();
  initHealthScore();
  initSearch();
  initReports();
  initSettings();

  // Any state change anywhere in the dashboard can move the overall
  // city status and health score — recompute centrally instead of
  // scattering that responsibility across every feature module.
  const recompute = () => {
    updateCityStatus();
    updateHealthScore();
  };
  [
    Events.TRAFFIC_CHANGED, Events.ENERGY_CHANGED, Events.ENVIRONMENT_CHANGED,
    Events.EMERGENCY_CHANGED, Events.WATER_CHANGED, Events.LIGHTS_CHANGED,
  ].forEach((evt) => on(evt, recompute));

  startSimulation();
  showToast('NOVA CITY control center online.', 'success');
}

document.addEventListener('DOMContentLoaded', initializeDashboard);