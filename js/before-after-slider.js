/**
 * WOLFPix Salon - Before & After Comparison Slider
 * Touch, Pointer & Keyboard Draggable
 */

export function initBeforeAfterSlider() {
  const container = document.getElementById('comparisonContainer');
  const beforeLayer = document.getElementById('comparisonBeforeLayer');
  const handle = document.getElementById('comparisonHandle');
  const beforeImg = document.getElementById('comparisonBeforeImg');

  if (!container || !beforeLayer || !handle || !beforeImg) return;

  let isDragging = false;

  function updateSliderPosition(xCoord) {
    const rect = container.getBoundingClientRect();
    let posX = xCoord - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    beforeLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
    beforeImg.style.width = `${rect.width}px`;
  }

  function onPointerDown(e) {
    isDragging = true;
    updateSliderPosition(e.clientX || (e.touches && e.touches[0].clientX));
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  }

  function onPointerUp() {
    isDragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  function onTouchMove(e) {
    if (!isDragging || !e.touches.length) return;
    e.preventDefault();
    updateSliderPosition(e.touches[0].clientX);
  }

  function onTouchEnd() {
    isDragging = false;
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  }

  container.addEventListener('pointerdown', onPointerDown);

  // Resize listener to maintain 1:1 image alignment
  window.addEventListener('resize', () => {
    const rect = container.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
  });

  // Initial alignment
  setTimeout(() => {
    const rect = container.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
    updateSliderPosition(rect.left + rect.width * 0.5);
  }, 100);
}
