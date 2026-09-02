export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randInt(min, max) {
  return Math.floor(randRange(min, max + 1));
}

export function jitter(value, amount, min = -Infinity, max = Infinity) {
  return clamp(value + randRange(-amount, amount), min, max);
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function timeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

export function formatClockTime(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

export function formatDate(date) {
  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

let uidCounter = 1000;
export function nextId(prefix = 'ID') {
  uidCounter += 1;
  return `${prefix}-${uidCounter}`;
}

/** Animate a number from its current displayed value to a new one. */
export function animateCount(el, newValue, { decimals = 0, suffix = '' } = {}) {
  const start = parseFloat(el.dataset.rawValue || el.textContent) || 0;
  const end = newValue;
  const duration = 500;
  const startTime = performance.now();

  function step(now) {
    const progress = clamp((now - startTime) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.dataset.rawValue = end;
    }
  }
  requestAnimationFrame(step);
}

export function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}