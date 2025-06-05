
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  block.querySelectorAll(':scope > div > div').forEach((col) => {
    col.classList.add('column');
    const link = col.querySelector('a');
    if (!link) return;

    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.className = 'column-link';
    
    link.closest('p')?.remove();
    anchor.append(...col.childNodes);
    col.append(anchor);
  });
}