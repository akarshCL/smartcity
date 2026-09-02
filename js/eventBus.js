// Minimal pub/sub bus. Every module communicates state changes through
// this instead of reaching into each other's DOM — that's what keeps
// "click a light -> energy KPI updates -> health score recalculates"
// possible without tangled cross-imports.
const handlers = new Map();

export function on(event, fn) {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event).add(fn);
  return () => handlers.get(event).delete(fn);
}

export function emit(event, detail) {
  if (!handlers.has(event)) return;
  for (const fn of handlers.get(event)) fn(detail);
}

export const Events = {
  TRAFFIC_CHANGED: 'traffic:changed',
  ENERGY_CHANGED: 'energy:changed',
  ENVIRONMENT_CHANGED: 'environment:changed',
  EMERGENCY_CHANGED: 'emergency:changed',
  TRANSPORT_CHANGED: 'transport:changed',
  LIGHTS_CHANGED: 'lights:changed',
  WATER_CHANGED: 'water:changed',
  ALERTS_CHANGED: 'alerts:changed',
  THEME_CHANGED: 'theme:changed',
  MAP_SELECT: 'map:select',
  NAV_CHANGE: 'nav:change',
  WEATHER_CHANGED: 'weather:changed',
};