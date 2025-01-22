import generalStyles from '../../../dist/css/gifa11y.min.css';
import toggleAll from "./toggleAll";

// Create web component container.
export class Gifa11yButton extends HTMLElement {
  constructor() {
    super();
    this.option = window.gifa11yOption;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    // Styles
    const style = document.createElement('style');
    style.innerHTML = `
      ${generalStyles}
      button {
        background: ${this.option.buttonBackground};
        border: ${this.option.buttonBorder};
        color: ${this.option.buttonIconColor};
      }
      button:hover, button:focus-visible {
        background: ${this.option.buttonBackgroundHover};
      }
      button:focus-visible {
        box-shadow: 0 0 0 5px ${this.option.buttonFocusColor};
      }
      .v1 {
        border-radius: ${this.option.buttonBorderRadius};
      }
      i {
        font-size: ${this.option.buttonIconFontSize};
        min-width: calc(${this.option.buttonIconFontSize} * 1.4);
        min-height: calc(${this.option.buttonIconFontSize} * 1.4);
      }
      svg {
        height: ${this.option.buttonIconSize};
        width: ${this.option.buttonIconSize};
      }
      button:after {
        font-size: ${this.option.buttonIconFontSize};
      }
      .warning, .warning:hover {
        border-radius: 5px;
        background: #cf0000;
        color: white;
      }
      .warning:after {
        content: '${this.option.langAltWarning}';
        padding: 5px;
      }`;
    shadow.appendChild(style);
  }
}

export function generateButtons(gif, option) {
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

  // Create button
  const pauseButton = document.createElement('button');

  // If alt is missing, indicate as such on button label and canvas element.
  let alt = image.getAttribute('alt');
  if (alt === null || alt === '' || alt === ' ') {
    alt = option.langMissingAlt;

    // Give a friendly reminder to add alt text.
    if (option.missingAltWarning === true) {
      pauseButton.classList.add('warning');
    }
  }

  // Button properties
  pauseButton.setAttribute('aria-label', `${initialState} ${alt}`);
  pauseButton.setAttribute('data-gifa11y-state', currentState);
  pauseButton.setAttribute('data-gifa11y-alt', alt);
  pauseButton.innerHTML = `
  <div class="pause" aria-hidden="true"></div>
  <div class="play" aria-hidden="true" style="display:${playDisplay}"></div>`;
  const pauseIcon = pauseButton.querySelector('.pause');
  pauseIcon.style.display = pauseDisplay;
  const playIcon = pauseButton.querySelector('.play');
  playIcon.style.display = playDisplay;

  // Preferred style.
  if (option.showGifText === false) {
    pauseButton.classList.add('v1');
  } else {
    pauseButton.classList.add('v2');
  }

  /* Pause icon. */
  if (option.buttonPauseIconID.length) {
    // If icon is supplied via ID on page.
    const customPauseIcon = document.getElementById(option.buttonPauseIconID).innerHTML;
    pauseIcon.innerHTML = customPauseIcon;
  } else if (option.buttonPauseIconHTML.length) {
    // If icon is supplied via icon font or HTML.
    pauseIcon.innerHTML = option.buttonPauseIconHTML;
  } else {
    pauseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
  }

  /* Play icon. */
  if (option.buttonPlayIconID.length) {
    // If icon is supplied via ID on page.
    const customPlayIcon = document.getElementById(option.buttonPlayIconID).innerHTML;
    playIcon.innerHTML = customPlayIcon;
  } else if (option.buttonPlayIconHTML.length) {
    // If icon is supplied via icon font or HTML.
    playIcon.innerHTML = option.buttonPlayIconHTML;
  } else {
    playIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
  }

  // If gif is within a hyperlink, insert button before it.
  const location = image.closest('a, button, [role="link"], [role="button"]') || image;

  // Inject into DOM.
  const instance = document.createElement('gifa11y-button');
  location.insertAdjacentElement('beforebegin', instance);
  instance.shadowRoot.appendChild(pauseButton);

  // Add functionality.
  pauseButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (option.buttonPauseShared) {
      toggleAll();
      return;
    }

    const getState = pauseButton.getAttribute('data-gifa11y-state');
    const state = getState === 'paused' ? 'playing' : 'paused';
    pauseButton.setAttribute('data-gifa11y-state', state);

    const gifA11ySet = new CustomEvent('gifA11ySet', {
      detail: {
        newState: state,
        button: pauseButton
      }
    });
    window.dispatchEvent(gifA11ySet);

    const play = pauseButton.querySelector('.play');
    const pause = pauseButton.querySelector('.pause');

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
  }, false);
}
