// Inside src/js/certifications.js (Board view hover preview logic):

const popover = document.querySelector('.cert-board-preview-popover') || createPopoverElement();

function createPopoverElement() {
  const el = document.createElement('div');
  el.className = 'cert-board-preview-popover';
  el.innerHTML = `<img src="" alt="Certificate Preview" id="board-preview-img">`;
  document.body.appendChild(el);
  return el;
}

const previewImg = popover.querySelector('img');

document.querySelectorAll('.cert-board-table tbody tr').forEach(row => {
  row.addEventListener('pointerenter', (e) => {
    const imgSrc = row.dataset.certImage;
    if (!imgSrc) return;
    
    previewImg.src = imgSrc;
    popover.classList.add('is-active');
    updatePopoverPos(e);
  });

  row.addEventListener('pointermove', (e) => {
    updatePopoverPos(e);
  });

  row.addEventListener('pointerleave', () => {
    popover.classList.remove('is-active');
  });
});

function updatePopoverPos(e) {
  const offsetX = 20;
  const offsetY = 20;
  const popoverWidth = 280;
  const popoverHeight = 210;
  
  let left = e.clientX + offsetX;
  let top = e.clientY + offsetY;

  // Screen boundary detection to prevent clipping off screen edges
  if (left + popoverWidth > window.innerWidth - 16) {
    left = e.clientX - popoverWidth - offsetX;
  }
  if (top + popoverHeight > window.innerHeight - 16) {
    top = e.clientY - popoverHeight - offsetY;
  }

  popover.style.transform = `translate3d(${left}px, ${top}px, 0)`;
}