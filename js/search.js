import { state } from './state.js';
import { debounce } from './utils.js';
import { openModal } from './modal.js';
import { showRoadDetail } from './traffic.js';
import { showFacilityDetail } from './map.js';

let input, resultsEl;

export function initSearch() {
  input = document.getElementById('searchInput');
  resultsEl = document.getElementById('searchResults');

  input.addEventListener('input', debounce(() => runSearch(input.value.trim()), 150));
  input.addEventListener('focus', () => { if (input.value.trim()) runSearch(input.value.trim()); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) resultsEl.classList.remove('is-open');
  });
}

function buildIndex() {
  const items = [];
  state.roads.forEach((r) => items.push({ tag: 'Road', label: r.label, action: () => showRoadDetail(r.id) }));
  state.facilities.forEach((f) => items.push({ tag: f.type, label: f.name, action: () => showFacilityDetail(f.id) }));
  state.emergencies.forEach((e) => items.push({ tag: 'Incident', label: `${e.type} — ${e.location}`, action: () => showIncidentQuick(e.id) }));
  state.transport.forEach((t) => items.push({ tag: t.mode, label: `${t.id.replace('-', ' ')} — ${t.route}`, action: () => goToPage('transport') }));
  return items;
}

function showIncidentQuick(id) {
  goToPage('emergency');
}

function goToPage(page) {
  document.querySelector(`.nav-item[data-page="${page}"]`)?.click();
}

function runSearch(query) {
  if (!query) {
    resultsEl.classList.remove('is-open');
    resultsEl.innerHTML = '';
    return;
  }
  const q = query.toLowerCase();
  const matches = buildIndex()
    .filter((item) => item.label.toLowerCase().includes(q))
    .slice(0, 8);

  resultsEl.innerHTML =
    matches
      .map(
        (m, i) => `<div class="search-result-item" data-idx="${i}"><span>${m.label}</span><span class="sr-tag">${m.tag}</span></div>`
      )
      .join('') || '<div class="search-empty">No matches for &ldquo;' + query + '&rdquo;</div>';

  resultsEl.classList.add('is-open');

  resultsEl.querySelectorAll('.search-result-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      matches[i].action();
      resultsEl.classList.remove('is-open');
      input.value = '';
    });
  });
}
