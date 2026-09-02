import { emit, Events } from './eventBus.js';

export function initSidebar() {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('sidebarScrim');
  const hamburger = document.getElementById('hamburgerBtn');

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.page;
      navItems.forEach((n) => n.setAttribute('aria-current', n === item ? 'page' : 'false'));
      pages.forEach((p) => p.classList.toggle('is-active', p.id === `page-${target}`));
      closeDrawer();
      emit(Events.NAV_CHANGE, target);
      document.getElementById('main').scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  function openDrawer() {
    sidebar.classList.add('is-open');
    scrim.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    sidebar.classList.remove('is-open');
    scrim.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
  scrim.addEventListener('click', closeDrawer);
}
