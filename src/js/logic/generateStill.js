export default function generateStill(gif, option) {
  const image = gif;

  // Initial setup of canvas element.
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'image');
  canvas.setAttribute('aria-label', image.alt);
  canvas.setAttribute('data-gifa11y-canvas', '');
  canvas.hidden = false;

  // Fetch original image dimensions directly from the image.
  const { naturalWidth, naturalHeight } = image;

  // Use device pixel ratio for high-resolution rendering.
  const pixelRatio = window.devicePixelRatio || 1;

  // Set the canvas internal resolution to match the scaled dimensions.
  canvas.width = option.useDevicePixelRatio
    ? naturalWidth * pixelRatio : naturalWidth;
  canvas.height = option.useDevicePixelRatio
    ? naturalHeight * pixelRatio : naturalHeight;

  // Match the canvas style size to the image's current dimensions.
  const setCanvasSize = () => {
    const computedStyle = window.getComputedStyle(image);
    canvas.style.width = computedStyle.width;
    canvas.style.height = computedStyle.height;
  };
  setCanvasSize();

  // Make responsive.
  window.addEventListener('resize', setCanvasSize);

  // Draw the image onto the canvas with precise dimensions.
  const context = canvas.getContext('2d', { alpha: false });
  if (option.useDevicePixelRatio) context.scale(pixelRatio, pixelRatio);
  context.drawImage(image, 0, 0, naturalWidth, naturalHeight);

  // Inject the canvas into the DOM right before the image.
  const parent = image.parentNode;
  parent.insertBefore(canvas, image);
  image.after(canvas);

  // Inherit CSS classes from the image if specified.
  if (option.inheritClasses) {
    const classes = image.getAttribute('class') || '';
    canvas.setAttribute('class', classes);
  }

  // Alt text missing warning.
  let altText = image.getAttribute('alt')?.trim();
  if (!altText) altText = option.langMissingAlt;

  // If content author wants GIF to be paused initially (or prefers reduced motion).
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const shouldPause = mediaQuery.matches
    || image.classList.contains('gifa11y-paused')
    || image.src.includes('gifa11y-paused')
    || option.initiallyPaused;

  image.style.display = shouldPause ? 'none' : '';
  canvas.style.display = shouldPause ? '' : 'none';
  image.setAttribute('data-gifa11y-state', shouldPause ? 'paused' : 'playing');
}
