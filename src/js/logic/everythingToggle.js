import toggleAll from './toggleAll';

export default function everythingToggle() {
  const option = window.gifa11yOption;
  const everythingButton = document.getElementById('gifa11y-all');
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const html = document.querySelector('html');

  // Only initialize if page contains toggle all on/off button.
  if (everythingButton !== null) {
    // Set initial page state based on media query and props.
    if (!mediaQuery || mediaQuery.matches || option.initiallyPaused) {
      html.setAttribute('data-gifa11y-all', 'paused');
      everythingButton.innerText = option.langPlayAllButton;
    } else {
      html.setAttribute('data-gifa11y-all', 'playing');
      everythingButton.innerText = option.langPauseAllButton;
    }

    // Disable button initially to prevent people from clicking it too soon. Otherwise canvas won't generate.
    everythingButton.setAttribute('disabled', 'true');
    const notReady = window.a11ygifs.filter((image) => !image.complete);
    if (notReady.length > 0) {
      const promises = window.a11ygifs.filter((image) => !image.complete)
        .map((image) => new Promise((resolve) => {
          const resolveImage = image;
          resolveImage.onload = resolve;
          resolveImage.onerror = resolve;
        }));
      Promise.all(promises).then(() => {
        if (everythingButton) {
          // Add click handler to toggle all buttons.
          everythingButton.addEventListener('click', () => {
            toggleAll();
          });

          // Remove 'disabled' attribute once all images have fully loaded.
          everythingButton.removeAttribute('disabled');
        }
      });
    }

    // If promises fail, we'll wait 5 seconds before resetting the toggle all button.
    window.setTimeout(() => {
      // Prevent bubbling.
      everythingButton.removeEventListener('click', toggleAll);

      // Ensure current page state is passed to toggle all button.
      const state = html.getAttribute('data-gifa11y-all') === 'paused' ? 'paused' : 'playing';
      everythingButton.addEventListener('click', toggleAll(state), { once: true });

      // Ensure 'disabled' attribute is removed.
      everythingButton.removeAttribute('disabled');
    }, 5000);
  }
}
