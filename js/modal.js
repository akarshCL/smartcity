let overlay, titleEl, bodyEl, lastFocused;

export function initModal() {
  overlay = document.getElementById('modalOverlay');
  titleEl = document.getElementById('modalTitle');
  bodyEl = document.getElementById('modalBody');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
}

/**
 * @param {string} title
 * @param {string} html
 */
export function openModal(title, html) {
  lastFocused = document.activeElement;
  titleEl.textContent = title;
  bodyEl.innerHTML = html;
  overlay.classList.add('is-open');
  document.getElementById('modalClose').focus();
}

export function closeModal() {
  overlay.classList.remove('is-open');
  bodyEl.innerHTML = '';
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}
