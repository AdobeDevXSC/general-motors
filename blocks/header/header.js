import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    toggleMenu(nav, navSections, false);
    nav.querySelector('.nav-hamburger button').focus();
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const isCurrentlyExpanded = nav.getAttribute('aria-expanded') === 'true';
  const willExpand = forceExpanded !== null ? forceExpanded : !isCurrentlyExpanded;

  isCurrentlyExpanded ?  nav.classList.remove('nav-open') : nav.classList.add('nav-open');

  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = willExpand ? 'hidden' : '';

  const overlay = nav.querySelector('.nav-overlay');
  if (overlay) {
    overlay.style.display = willExpand ? 'block' : 'none';
  }

  nav.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
  button.setAttribute('aria-label', willExpand ? 'Close navigation' : 'Open navigation');

  if (willExpand) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Create overlay and add it to nav first
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.style.display = 'none';
  overlay.addEventListener('click', () => {
    const navSections = nav.querySelector('.nav-sections');
    toggleMenu(nav, navSections, false);
  });
  nav.appendChild(overlay);

  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i + 1]; // +1 because overlay is now first child
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
    });
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  const closeButton = document.createElement('button');
  closeButton.className = 'nav-close';
  closeButton.innerHTML = '✕';
  closeButton.setAttribute('aria-label', 'Close navigation');
  closeButton.addEventListener('click', () => toggleMenu(nav, navSections, false));
  navSections.prepend(closeButton);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}