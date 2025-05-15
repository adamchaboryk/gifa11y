/*! Gifa11y 2.2.0 | @author Adam Chaboryk © 2021 - 2025 | @license MIT | @contact adam@chaboryk.xyz | https://github.com/adamchaboryk/gifa11y */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Gifa11y = factory());
})(this, (function () { 'use strict';

  function findGifs($newGifs, option) {
    // Find GIFs within specified container, fallback to 'body'.
    const root = document.querySelector(option.container);
    const container = (!root) ? document.querySelector('body') : root;

    // Check for additional images supplied through instantiation.
    const exclusions = (!option.exclusions) ? '' : `, ${option.exclusions}`;

    // Query DOM for images.
    const images = Array.from(container.querySelectorAll(`:is(${option.target}):not([src*="gifa11y-ignore"], [data-gifa11y-state], .gifa11y-ignore${exclusions})`));

    // Update $gifs array.
    images.forEach(($gif) => {
      $newGifs.push($gif);
    });
  }

  function generateStill(gif, option) {
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

  var generalStyles = ":host{--gifa11y-font:system-ui,\"Segoe UI\",roboto,helvetica,arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"}*,:after,:before{box-sizing:border-box}button{align-items:center;box-shadow:0 0 16px 0 rgba(0,0,0,.31);cursor:pointer;display:flex;justify-content:center;line-height:normal;margin:12px;min-height:36px;min-width:36px;padding:4px;position:absolute;text-align:center;transition:all .2s ease-in-out;z-index:500}button:before{content:\"\";inset:-8.5px;min-height:50px;min-width:50px;position:absolute}button:focus-visible{outline:3px solid transparent}.v2{align-items:center;border-radius:5px;display:flex;flex-wrap:wrap;place-content:center center;text-align:center}.v2:after{content:\"GIF\";display:inline-block;font-family:var(--gifa11y-font);font-weight:600;line-height:0;padding-left:3px;padding-right:3px}i{padding:4px}i,svg{vertical-align:middle}svg{display:block;flex-shrink:0;position:relative}";

  function toggleAll(newState = 'detect') {
    let state = newState;
    const option = window.gifa11yOption;
    const everythingButton = document.getElementById('gifa11y-all');
    const html = document.querySelector('html');

    // Detect current page state and dispatch event.
    if (state === 'detect') {
      state = html.getAttribute('data-gifa11y-all') === 'paused'
        ? 'playing' : 'paused';
      const gifa11yState = new CustomEvent('gifa11yState', {
        detail: {
          newState: state,
          target: 'all',
        },
      });
      window.dispatchEvent(gifa11yState);
    }

    // Set the page state.
    html.setAttribute('data-gifa11y-all', state);

    // Change properties based on page state.
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

    // Toggle display of all <img src="*.gif"> on the page.
    window.a11ygifs.forEach(($el) => {
      const gif = $el;
      gif.style.display = pauseDisplay;
    });

    // Toggle display of all <canvas> elements on the page.
    const allCanvas = document.querySelectorAll('[data-gifa11y-canvas]');
    allCanvas.forEach(($el) => {
      const canvas = $el;
      canvas.style.display = playDisplay;
    });

    // Toggle state of all play/pause buttons on the page.
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
  <div class="pause" aria-hidden="true"></div>
  <div class="play" aria-hidden="true" style="display:${playDisplay}"></div>`;
    const pauseIcon = pauseButton.querySelector('.pause');
    pauseIcon.style.display = pauseDisplay;
    const playIcon = pauseButton.querySelector('.play');
    playIcon.style.display = playDisplay;

    // Preferred style.
    pauseButton.classList.add(option.showGifText ? 'v2' : 'v1');

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

      const getState = pauseButton.getAttribute('data-gifa11y-state');
      const state = getState === 'paused' ? 'playing' : 'paused';
      const gifa11yState = new CustomEvent('gifa11yState', {
        detail: {
          newState: state,
          button: pauseButton,
        },
      });
      window.dispatchEvent(gifa11yState);

      // If all buttons share the same pause state.
      if (option.sharedPauseButton) {
        toggleAll(state);
        return;
      }

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
    }, false);
  }

  function everythingToggle() {
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

  class Gifa11y {
    constructor(options) {
      const defaultConfig = {
        buttonBackground: '#072c7c',
        buttonBackgroundHover: '#0a2051',
        buttonBorder: '2px solid #fff',
        buttonBorderRadius: '50%',
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
        langPause: 'Pause animation:',
        langPlay: 'Play animation:',
        langPauseAllButton: 'Pause all animations',
        langPlayAllButton: 'Play all animations',
        langMissingAlt: 'Missing image description.',
        langAltWarning: 'Error! Please add alt text to gif.',
        missingAltWarning: true,
        sharedPauseButton: false,
        showButtons: true,
        showGifText: false,
        target: 'img[src$=".gif"]',
        useDevicePixelRatio: false,
      };
      const option = { ...defaultConfig, ...options };
      window.gifa11yOption = option;

      // List of all gifs on the page.
      window.a11ygifs = [];

      // Query page for new gifs.
      this.findNew = () => {
        const $newGifs = [];
        // Find and cache gifs.
        findGifs($newGifs, option);

        // Iterate through all gifs after they finish loading.
        $newGifs.forEach(($el) => {
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
          window.a11ygifs.push($el);
        });
      };

      // Method to programmatically play/pause Gifa11y.
      this.setAll = (newState) => {
        toggleAll(newState);
      };

      this.initialize = () => {
        // Do not run Gifa11y if any supplied elements detected on page.
        const checkRunPrevent = () => {
          const { gifa11yOff } = option;
          return gifa11yOff.trim().length > 0 ? document.querySelector(gifa11yOff) : false;
        };

        if (!checkRunPrevent()) {
          // Register web component.
          customElements.define('gifa11y-button', Gifa11yButton);

          // Run Gifa11y on page load.
          document.addEventListener('DOMContentLoaded', () => {
            this.findNew();

            // Initialize toggle everything button.
            everythingToggle();
          }, false);
        }
      };
      this.initialize();
    }
  }

  return Gifa11y;

}));
