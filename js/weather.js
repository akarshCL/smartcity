import { state } from './state.js';
import { on, Events } from './eventBus.js';

let tempEl, condEl, statsEl, forecastEl;

export function initWeather() {
  tempEl = document.getElementById('weatherTemp');
  condEl = document.getElementById('weatherCond');
  statsEl = document.getElementById('weatherStats');
  forecastEl = document.getElementById('weatherForecast');

  on(Events.WEATHER_CHANGED, render);
  render();
}

function render() {
  const w = state.weather;
  tempEl.textContent = `${Math.round(state.temperature.value)}°C`;
  condEl.textContent = w.condition;

  statsEl.innerHTML = `
    <div class="ws-item"><div class="ws-label">HUMIDITY</div><div class="ws-val">${w.humidity}%</div></div>
    <div class="ws-item"><div class="ws-label">WIND</div><div class="ws-val">${w.wind} km/h</div></div>
    <div class="ws-item"><div class="ws-label">VISIBILITY</div><div class="ws-val">${w.visibility} km</div></div>
  `;

  forecastEl.innerHTML = w.forecast
    .map((f) => `<div class="forecast-day"><div class="fd-name">${f.day}</div><div class="fd-icon">${f.icon}</div><div class="fd-temp">${f.temp}°</div></div>`)
    .join('');
}
