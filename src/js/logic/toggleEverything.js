export default function toggleEverything($gifs, option) {
  const everythingButton = document.getElementById('gifa11y-all');
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const html = document.querySelector('html');

  function toggleAll() {
    everythingButton.addEventListener('click', () => {
      const state = html.getAttribute('data-gifa11y-all') === 'paused'
        ? 'playing' : 'paused';
      html.setAttribute('data-gifa11y-all', state);

      let playDisplay;
      let pauseDisplay;
      let currentState;
      let ariaLabel;
      const pageState = html.getAttribute('data-gifa11y-all');
      if (pageState === 'paused') {
        playDisplay = 'block';
        pauseDisplay = 'none';
        currentState = 'paused';
        ariaLabel = option.langPlay;
        everythingButton.innerText = option.langPlayAllButton;
      } else {
        playDisplay = 'none';
        pauseDisplay = 'block';
        currentState = 'playing';
        ariaLabel = option.langPause;
        everythingButton.innerText = option.langPauseAllButton;
      }

      $gifs.forEach(($el) => {
        const gif = $el;
        gif.style.display = pauseDisplay;
      });

      const allCanvas = document.querySelectorAll('[data-gifa11y-canvas]');
      allCanvas.forEach(($el) => {
        const canvas = $el;
        canvas.style.display = playDisplay;
      });

      const allButtons = document.querySelectorAll('gifa11y-button');
      allButtons.forEach(($el) => {
        const shadow = $el.shadowRoot.querySelector('button');
        const alt = shadow.getAttribute('data-gifa11y-alt');
        const play = shadow.querySelector('.play');
        const pause = shadow.querySelector('.pause');
        play.style.display = playDisplay;
        pause.style.display = pauseDisplay;
        shadow.setAttribute('data-gifa11y-state', currentState);
        shadow.setAttribute('aria-label', `${ariaLabel} ${alt}`);
      });
    });
  }

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
    everythingButton.setAttribute('disabled', true);
    const promises = $gifs.filter((image) => !image.complete)
      .map((image) => new Promise((resolve) => {
        const resolveImage = image;
        resolveImage.onload = resolve;
        resolveImage.onerror = resolve;
      }));
    Promise.all(promises).then(() => {
      toggleAll();
      // Remove 'disabled' attribute once all images have fully loaded.
      everythingButton.removeAttribute('disabled');
    });
  }
}
