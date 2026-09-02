import * as data from './data.js';
import { loadState } from './storage.js';

// One mutable object every module reads from and writes to. Modules never
// talk to each other's DOM directly — they mutate `state`, then emit an
// event (see eventBus.js) so interested renderers can react.
export const state = {
  temperature: { value: 28, feelsLike: 30 },
  roads: data.makeRoads(),
  facilities: data.makeFacilities(),
  signals: data.makeSignals(),
  emergencies: data.makeEmergencies().filter((e) => !loadState('resolvedIncidents', []).includes(e.id)),
  transport: data.makeTransport(),
  streetlights: loadState('streetlights', data.makeStreetlights()),
  alerts: data.makeAlerts(),
  environment: data.makeEnvironment(),
  energy: data.makeEnergy(),
  water: data.makeWater(),
  weather: data.makeWeather(),
  activityLog: [],
  resolvedIncidentIds: loadState('resolvedIncidents', []),
  energyRange: '24h',
  cityStatus: 'NORMAL',
  healthScore: 86,
  filters: { traffic: 'All', emergency: 'All', transport: 'All' },
};

export function trafficSummary() {
  const summary = { high: 0, moderate: 0, normal: 0 };
  state.roads.forEach((r) => summary[r.level]++);
  return summary;
}
