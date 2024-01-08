/*! Gifa11y 2.0.2 | @author Adam Chaboryk © 2021 - 2024 | @license MIT | @contact adam@chaboryk.xyz | https://github.com/adamchaboryk/gifa11y */
function findGifs($gifs, option) {
  // Find GIFs within specified container, fallback to 'body'.
  const root = document.querySelector(option.container);
  const container = (!root) ? document.querySelector('body') : root;

  // Check for additional images supplied through instantiation.
  const additionalImages = (!option.target) ? '' : `, ${option.target}`;
  const exclusions = (!option.exclusions) ? '' : `, ${option.exclusions}`;

  // Query DOM for images.
  const images = Array.from(container.querySelectorAll(`:is(img[src$=".gif"]${additionalImages}):not([src*="gifa11y-ignore"], .gifa11y-ignore${exclusions})`));

  // Update $gifs array.
  images.forEach(($gif) => {
    $gifs.push($gif);
  });
}

function generateStill(gif, option) {
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

var generalStyles = ":host{--gifa11y-font:system-ui,\"Segoe UI\",roboto,helvetica,arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"}*,:after,:before{box-sizing:border-box}button{align-items:center;box-shadow:0 0 16px 0 rgba(0,0,0,.31);cursor:pointer;display:flex;justify-content:center;line-height:normal;margin:12px;min-height:36px;min-width:36px;padding:4px;position:absolute;text-align:center;transition:all .2s ease-in-out;z-index:500}button:before{content:\"\";inset:-8.5px;min-height:50px;min-width:50px;position:absolute}button:focus{outline:3px solid transparent}.v1{border-radius:50%}.v2{align-content:center;align-items:center;border-radius:5px;display:flex;flex-wrap:wrap;justify-content:center;text-align:center}.v2:after{content:\"GIF\";display:inline-block;font-family:var(--gifa11y-font);font-weight:600;line-height:0;padding-left:3px;padding-right:3px}i{padding:4px}i,svg{vertical-align:middle}svg{display:block;flex-shrink:0;position:relative}";

// Create web component container.
class Gifa11yButton extends HTMLElement {
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
      button:hover, button:focus {
        background: ${this.option.buttonBackgroundHover};
      }
      button:focus {
        box-shadow: 0 0 0 5px ${this.option.buttonFocusColor};
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

function generateButtons(gif, option) {
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
  <div class="pause" aria-hidden="true" style="display:${pauseDisplay}"></div>
  <div class="play" aria-hidden="true" style="display:${playDisplay}"></div>`;
  const pauseIcon = pauseButton.querySelector('.pause');
  const playIcon = pauseButton.querySelector('.play');

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
  let location = image.closest('a, button') || image;

  // Inject into DOM.
  const instance = document.createElement('gifa11y-button');
  location.insertAdjacentElement('beforebegin', instance);
  instance.shadowRoot.appendChild(pauseButton);

  // Add functionality.
  pauseButton.addEventListener('click', (e) => {
    const getState = pauseButton.getAttribute('data-gifa11y-state');
    const state = getState === 'paused' ? 'playing' : 'paused';
    pauseButton.setAttribute('data-gifa11y-state', state);

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
    e.preventDefault();
  }, false);
}

function toggleEverything($gifs, option) {
  const everythingButton = document.getElementById('gifa11y-all');
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const html = document.querySelector('html');

  function toggleAll() {
    everythingButton.addEventListener('click', () => {
      const state = html.getAttribute('data-gifa11y-all') === 'paused' ? 'playing' : 'paused';
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
        $el.setAttribute('style', `display: ${pauseDisplay}`);
      });

      const allCanvas = document.querySelectorAll('[data-gifa11y-canvas]');
      allCanvas.forEach(($el) => {
        $el.setAttribute('style', `display: ${playDisplay}`);
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
    if (!mediaQuery || mediaQuery.matches || option.initiallyPaused === true) {
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

class Gifa11y {
  constructor(options) {
    const defaultConfig = {
      buttonBackground: '#072c7c',
      buttonBackgroundHover: '#0a2051',
      buttonBorder: '2px solid #fff',
      buttonIconColor: 'white',
      buttonFocusColor: '#00e7ffad',
      buttonIconSize: '1.5rem',
      buttonIconFontSize: '1rem',
      buttonPlayIconID: '',
      buttonPauseIconID: '',
      buttonPlayIconHTML: '',
      buttonPauseIconHTML: '',
      container: 'body',
      exclusions: '',
      gifa11yOff: '',
      inheritClasses: true,
      initiallyPaused: false,
      langPause: 'Pause GIF:',
      langPlay: 'Play GIF:',
      langPauseAllButton: 'Pause all GIFs',
      langPlayAllButton: 'Play all GIFs',
      langMissingAlt: 'Missing image description.',
      langAltWarning: 'Error! Please add alt text to GIF.',
      missingAltWarning: true,
      showButtons: true,
      showGifText: false,
      target: '',
    };
    const option = { ...defaultConfig, ...options };
    window.gifa11yOption = option;

    const $gifs = [];

    this.initialize = () => {
      // Do not run Gifa11y if any supplied elements detected on page.
      const checkRunPrevent = () => {
        const { gifa11yOff } = option;
        return gifa11yOff.trim().length > 0 ? document.querySelector(gifa11yOff) : false;
      };
      if (!checkRunPrevent()) {

        // Register web component.
        customElements.define('gifa11y-button', Gifa11yButton);

        document.addEventListener('DOMContentLoaded', () => {
          // Find and cache GIFs
          findGifs($gifs, option);

          // Iterate through all GIFs after they finish loading.
          $gifs.forEach(($el) => {

            // Generate stills & play/pause buttons.
            const doMagic = () => {
              generateStill($el, option);
              if (option.showButtons === true) {
                generateButtons($el, option);
              }
            };

            // Timing is important.
            if ($el.complete) {
              doMagic();
            } else {
              $el.addEventListener('load', doMagic);
            }
          });

          // Initialize toggle everything button.
          toggleEverything($gifs, option);
        }, false);
      }
    };
    this.initialize();
  }
}

export { Gifa11y as default };
