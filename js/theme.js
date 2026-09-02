import { saveState, loadState } from './storage.js';
import { emit, Events } from './eventBus.js';

export function initTheme() {
  const saved = loadState('theme', 'dark');
  applyTheme(saved);

  const btn = document.getElementById('themeToggleBtn');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveState('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.querySelector('.icon-sun').style.display = theme === 'dark' ? 'block' : 'none';
    btn.querySelector('.icon-moon').style.display = theme === 'dark' ? 'none' : 'block';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  emit(Events.THEME_CHANGED, theme);
}
