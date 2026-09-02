import { loadState } from './storage.js';

let stack;

export function initNotify() {
  stack = document.getElementById('toastStack');
}

/**
 * @param {string} message
 * @param {'info'|'success'|'warning'|'critical'} kind
 */
export function showToast(message, kind = 'info') {
  if (!stack) return;
  if (loadState('notifPref', true) === false) return;
  const icons = { info: 'ℹ', success: '✓', warning: '⚠', critical: '🚨' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.kind = kind;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span class="alert-icon">${icons[kind] || icons.info}</span><span>${message}</span>`;
  stack.appendChild(toast);

  const remove = () => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 200);
  };
  setTimeout(remove, 4200);
}
