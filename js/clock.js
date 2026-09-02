import { formatClockTime, formatDate } from './utils.js';

export function initClock() {
  const timeEl = document.getElementById('headerTime');
  const dateEl = document.getElementById('headerDate');

  function tick() {
    const now = new Date();
    timeEl.textContent = formatClockTime(now);
    dateEl.textContent = formatDate(now);
  }
  tick();
  setInterval(tick, 1000);
}
