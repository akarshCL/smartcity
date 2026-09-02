import { state } from './state.js';
import { emit, Events } from './eventBus.js';
import { jitter, randInt } from './utils.js';
import { pushAlert } from './alerts.js';

const RANDOM_ALERT_POOL = [
  { icon: '⚠', text: 'Heavy traffic reported on {road}', kind: 'warning' },
  { icon: '⚡', text: 'Power consumption increased by {pct}%', kind: 'warning' },
  { icon: '✓', text: 'Sensor calibration completed in Sector {n}', kind: 'info' },
  { icon: '🚦', text: 'Signal timing optimized on {road}', kind: 'info' },
];

export function startSimulation() {
  setInterval(tickTraffic, 4000);
  setInterval(tickEnergyAndEnvironment, 5000);
  setInterval(tickTransport, 9000);
  setInterval(maybeRandomAlert, 15000);
}

function tickTraffic() {
  state.roads.forEach((r) => {
    r.pct = Math.round(jitter(r.pct, 4, 5, 98));
    r.level = r.pct >= 70 ? 'high' : r.pct >= 40 ? 'moderate' : 'normal';
    r.speed = Math.round(jitter(r.speed, 2, 8, 60));
    r.vph = Math.round(jitter(r.vph, 60, 200, 2400));
  });
  emit(Events.TRAFFIC_CHANGED);
}

function tickEnergyAndEnvironment() {
  state.energy.current = +jitter(state.energy.current, 0.06, 0.8, 2.9).toFixed(2);
  state.energy.todayMWh = +(state.energy.todayMWh + Math.random() * 0.15).toFixed(1);
  const series = state.energy.history['24h'];
  series.push(Math.round(state.energy.current * 30));
  series.shift();
  emit(Events.ENERGY_CHANGED);

  state.environment.aqi = Math.round(jitter(state.environment.aqi, 3, 20, 180));
  state.environment.pm25 = Math.round(jitter(state.environment.pm25, 2, 8, 90));
  state.environment.pm10 = Math.round(jitter(state.environment.pm10, 3, 15, 140));
  state.environment.co2 = Math.round(jitter(state.environment.co2, 4, 380, 520));
  emit(Events.ENVIRONMENT_CHANGED);

  state.temperature.value = +jitter(state.temperature.value, 0.3, 18, 38).toFixed(1);
  state.temperature.feelsLike = +jitter(state.temperature.feelsLike, 0.3, 18, 40).toFixed(1);
  emit(Events.WEATHER_CHANGED);

  state.water.supplyPct = Math.round(jitter(state.water.supplyPct, 1, 55, 99));
  emit(Events.WATER_CHANGED);
}

function tickTransport() {
  if (Math.random() < 0.35) {
    const v = state.transport[randInt(0, state.transport.length - 1)];
    if (v.status === 'ontime' && Math.random() < 0.4) {
      v.status = 'delayed';
      v.statusText = `Delayed ${randInt(3, 12)} min`;
    } else {
      v.status = 'ontime';
      v.statusText = 'On Time';
    }
    emit(Events.TRANSPORT_CHANGED);
  }
}

function maybeRandomAlert() {
  if (Math.random() > 0.4) return;
  const template = RANDOM_ALERT_POOL[randInt(0, RANDOM_ALERT_POOL.length - 1)];
  const road = state.roads[randInt(0, state.roads.length - 1)].label;
  const text = template.text.replace('{road}', road).replace('{pct}', randInt(4, 18)).replace('{n}', randInt(1, 14));
  pushAlert(template.icon, text, template.kind);
}
