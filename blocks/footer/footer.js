import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);


  // decorate section one
  const sectionOne = footer.querySelector('.section:first-of-type .default-content-wrapper');
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'content-wrapper';

  for (const child of [...sectionOne.children]) {
    if (child.tagName === 'UL') break;
    if (child.tagName === 'P') contentWrapper.appendChild(child);
  }

  if (contentWrapper.children.length) {
    sectionOne.insertBefore(contentWrapper, sectionOne.querySelector('ul'));
  }

  // Update title attribute for all links to improve LHS
  const link = footer.querySelector('.section:first-of-type .button-container a');
  const href = link?.href;
  link.setAttribute('title', href);
  
  block.append(footer);
}
