const NS = 'novacity:';

export function saveState(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn('NovaCity: could not persist', key, err);
    return false;
  }
}

export function loadState(key, fallback = null) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (err) {
    console.warn('NovaCity: could not read', key, err);
    return fallback;
  }
}

export function clearAll() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(NS))
    .forEach((k) => localStorage.removeItem(k));
}
