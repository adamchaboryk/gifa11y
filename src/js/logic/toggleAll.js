export default function toggleAll(newState = 'detect') {
  const option = window.gifa11yOption;

  const everythingButton = document.getElementById('gifa11y-all');
  const html = document.querySelector('html');

  if (newState === 'detect') {
    newState = html.getAttribute('data-gifa11y-all') === 'paused'
      ? 'playing' : 'paused';
    const gifA11ySet = new CustomEvent('gifA11ySet', {
      detail: {
        newState: newState,
        target: 'all',
      },
    });
    window.dispatchEvent(gifA11ySet);
  }

  html.setAttribute('data-gifa11y-all', newState);

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
    if (everythingButton) {
      everythingButton.innerText = option.langPlayAllButton;
    }
    window.gifa11yOption.initiallyPaused = true; // For later loads.
  } else {
    playDisplay = 'none';
    pauseDisplay = 'block';
    currentState = 'playing';
    ariaLabel = option.langPause;
    if (everythingButton) {
      everythingButton.innerText = option.langPauseAllButton;
    }
    window.gifa11yOption.initiallyPaused = false;
  }

  window.a11ygifs.forEach(($el) => {
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
}
