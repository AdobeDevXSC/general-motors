
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  block.querySelectorAll(':scope > div > div').forEach((col) => {
    col.classList.add('column');
    const button = col.querySelector('.button-container a');
    if (!button) return;

    const anchor = document.createElement('a');
    anchor.href = button.href;
    anchor.className = 'column-link';
    
    button.closest('.button-container')?.remove();
    anchor.append(...col.childNodes);
    col.append(anchor);
  });
}