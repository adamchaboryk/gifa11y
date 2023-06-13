export default function generateStill(gif, option) {
  const image = gif;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'image');
  canvas.setAttribute('aria-label', image.alt);
  canvas.setAttribute('data-gifa11y-canvas', '');
  const { width } = image;
  const { height } = image;
  canvas.width = width;
  canvas.height = (image.naturalHeight / image.naturalWidth) * width + 0.5;
  canvas.hidden = false;
  const parent = image.parentNode;
  parent.insertBefore(canvas, image);
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);
  image.after(canvas);

  // Grab all classes from the original image.
  if (option.inheritClasses === true) {
    let classes = image.getAttribute('class');
    if (!classes) classes = '';
    canvas.setAttribute('class', classes);
  }

  // Alt text missing warning.
  let alt = image.getAttribute('alt');
  if (alt === null || alt === '' || alt === ' ') alt = option.langMissingAlt;

  // If content author wants GIF to be paused initially (or prefers reduced motion).
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (
    !mediaQuery
    || mediaQuery.matches
    || image.classList.contains('gifa11y-paused')
    || image.src.indexOf('gifa11y-paused') > -1
    || option.initiallyPaused === true
  ) {
    image.style.display = 'none';
    image.setAttribute('data-gifa11y-state', 'paused');
  } else {
    canvas.style.display = 'none';
    image.setAttribute('data-gifa11y-state', 'playing');
  }
}
