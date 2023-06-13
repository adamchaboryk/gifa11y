export default function generateButtons(
  gif,
  option,
) {
  const image = gif;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const findCanvas = image.nextElementSibling;

  let initialState;
  let currentState;
  let pauseDisplay;
  let playDisplay;
  const filename = image.src;
  if (
    !mediaQuery
    || mediaQuery.matches
    || image.classList.contains('gifa11y-paused')
    || filename.indexOf('gifa11y-paused') > -1
    || option.initiallyPaused === true
  ) {
    initialState = option.langPlay;
    playDisplay = 'block';
    pauseDisplay = 'none';
    currentState = 'paused';
  } else {
    initialState = option.langPause;
    playDisplay = 'none';
    pauseDisplay = 'block';
    currentState = 'playing';
  }

  // If alt is missing, indicate as such on button label and canvas element.
  let alt = image.getAttribute('alt');
  if (alt === null || alt === '' || alt === ' ') {
    alt = option.langMissingAlt;

    // Give a friendly reminder to add alt text.
    if (option.missingAltWarning === true) {
      const warning = document.createElement('div');
      warning.classList.add('gifa11y-warning');
      warning.innerHTML = option.langAltWarning;
      findCanvas.after(warning);
    }
  }

  // Create button
  const pauseButton = document.createElement('button');
  pauseButton.classList.add('gifa11y-btn');
  pauseButton.setAttribute('aria-label', `${initialState} ${alt}`);
  pauseButton.setAttribute('data-gifa11y-state', currentState);
  pauseButton.setAttribute('data-gifa11y-alt', alt);
  pauseButton.innerHTML = `
  <div class="gifa11y-pause-icon" aria-hidden="true" style="display:${pauseDisplay}"></div>
  <div class="gifa11y-play-icon" aria-hidden="true" style="display:${playDisplay}"></div>`;
  const pauseIcon = pauseButton.querySelector('.gifa11y-pause-icon');
  const playIcon = pauseButton.querySelector('.gifa11y-play-icon');

  // Preferred style.
  if (option.showGifText === false) {
    pauseButton.classList.add('gifa11y-v1');
  } else {
    pauseButton.classList.add('gifa11y-v2');
  }

  // Default icons.
  const defaultPlayIcon = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
  const defaultPauseIcon = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';

  // Pause icon.
  if (option.buttonPauseIconID.length > 1) {
    // If icon is supplied via ID on page.
    const customPauseIcon = document.getElementById(option.buttonPauseIconID).innerHTML;
    pauseIcon.innerHTML = customPauseIcon;
  } else if (option.buttonPauseIconHTML.length > 1) {
    // If icon is supplied via icon font or HTML.
    pauseIcon.innerHTML = option.buttonPauseIconHTML;
  } else {
    pauseIcon.innerHTML = defaultPauseIcon;
  }

  // Play icon.
  if (option.buttonPlayIconID.length > 1) {
    // If icon is supplied via ID on page.
    const customPlayIcon = document.getElementById(option.buttonPlayIconID).innerHTML;
    playIcon.innerHTML = customPlayIcon;
  } else if (option.buttonPlayIconHTML.length > 1) {
    // If icon is supplied via icon font or HTML.
    playIcon.innerHTML = option.buttonPlayIconHTML;
  } else {
    playIcon.innerHTML = defaultPlayIcon;
  }

  // If gif is within a hyperlink, insert button before it.
  let location = image.closest('a, button');
  if (!location) location = image;

  // Inject into DOM.
  location.insertAdjacentElement('beforebegin', pauseButton);

  // Add functionality.
  pauseButton.addEventListener('click', (e) => {
    const getState = pauseButton.getAttribute('data-gifa11y-state');
    const state = getState === 'paused' ? 'playing' : 'paused';
    pauseButton.setAttribute('data-gifa11y-state', state);

    const play = pauseButton.querySelector('.gifa11y-play-icon');
    const pause = pauseButton.querySelector('.gifa11y-pause-icon');

    if (pauseButton.getAttribute('data-gifa11y-state') === 'paused') {
      image.style.display = 'none';
      findCanvas.style.display = 'block';
      play.style.display = 'block';
      pause.style.display = 'none';
      pauseButton.setAttribute('aria-label', `${option.langPlay} ${alt}`);
    } else {
      image.style.display = 'block';
      findCanvas.style.display = 'none';
      play.style.display = 'none';
      pause.style.display = 'block';
      pauseButton.setAttribute('aria-label', `${option.langPause} ${alt}`);
    }
    e.preventDefault();
  }, false);
}
