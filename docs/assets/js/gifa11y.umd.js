/*! Gifa11y 2.0.0 | @author Adam Chaboryk © 2021 - 2023 | @license MIT | @contact adam@chaboryk.xyz | https://github.com/adamchaboryk/gifa11y */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Gifa11y = factory());
})(this, (function () { 'use strict';

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

  var styles = ":root{--gifa11y-font:system-ui,\"Segoe UI\",roboto,helvetica,arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"}button.gifa11y-btn,button.gifa11y-btn:after,button.gifa11y-btn:before{all:unset;box-sizing:border-box}button.gifa11y-btn{border:2px solid #fff;box-shadow:0 0 16px 0 rgba(0,0,0,.31);cursor:pointer;display:block;line-height:normal;margin:12px;min-height:36px;min-width:36px;padding:4px;position:absolute;text-align:center;transition:all .2s ease-in-out;z-index:500}button.gifa11y-btn.gifa11y-v1{border-radius:50%!important}button.gifa11y-btn.gifa11y-v2{align-content:center;align-items:center;border-radius:5px;display:flex;flex-wrap:wrap;justify-content:center;text-align:center}button.gifa11y-btn.gifa11y-v2:after{content:\"GIF\";display:inline-block;font-family:var(--gifa11y-font);font-weight:600;line-height:0;padding-left:3px;padding-right:3px}button.gifa11y-btn:before{content:\"\";inset:-8.5px;min-height:50px;min-width:50px;position:absolute}button.gifa11y-btn:focus{outline:3px solid transparent}button.gifa11y-btn>i{padding:4px;vertical-align:middle}button.gifa11y-btn>svg{flex-shrink:0;position:relative;vertical-align:middle}div.gifa11y-warning{background:#8b0000;color:#fff;font-family:var(--gifa11y-font);font-size:18px;line-height:normal;margin:0;padding:8px}";

  function generateStyle(option) {
    const style = document.createElement('style');
    style.innerHTML = `
  ${styles}
  button.gifa11y-btn {
    background: ${option.buttonBackground};
    color: ${option.buttonIconColor};
  }
  button.gifa11y-btn:hover, button.gifa11y-btn:focus {
    background: ${option.buttonBackgroundHover};
  }
  button.gifa11y-btn:focus {
    box-shadow: 0 0 0 5px ${option.buttonFocusColor};
  }
  .gifa11y-play-icon i,
  .gifa11y-pause-icon i {
    font-size: ${option.buttonIconFontSize};
    min-width: calc(${option.buttonIconFontSize} * 1.4);
    min-height: calc(${option.buttonIconFontSize} * 1.4);
  }
  .gifa11y-pause-icon > svg,
  .gifa11y-play-icon > svg {
    height: ${option.buttonIconSize};
    width: ${option.buttonIconSize};
  }
  button.gifa11y-btn::after {
    font-size: ${option.buttonIconFontSize};
  }`;
    document.head.appendChild(style);
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

  function generateButtons(
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
        const allButtons = document.querySelectorAll('button.gifa11y-btn');
        allButtons.forEach(($el) => {
          const alt = $el.getAttribute('data-gifa11y-alt');
          const play = $el.querySelector('.gifa11y-play-icon');
          const pause = $el.querySelector('.gifa11y-pause-icon');
          play.style.display = playDisplay;
          pause.style.display = pauseDisplay;
          $el.setAttribute('data-gifa11y-state', currentState);
          $el.setAttribute('aria-label', `${ariaLabel} ${alt}`);
        });
      });
    }

    // Only initialize if page contains toggle all on/off button.
    if (everythingButton !== null) {
      // Set initial page state based on media query and props.
      if (
        !mediaQuery
        || mediaQuery.matches
        || option.initiallyPaused === true
      ) {
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
        buttonBackground: 'indigo',
        buttonBackgroundHover: 'rebeccapurple',
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
        langAltWarning: '&#9888; Error! Please add alternative text to GIF.',
        missingAltWarning: true,
        showButtons: true,
        showGifText: false,
        target: '',
      };
      const option = { ...defaultConfig, ...options };
      const $gifs = [];

      this.initialize = () => {
        // Do not run Gifa11y if any supplied elements detected on page.
        const checkRunPrevent = () => {
          const { gifa11yOff } = option;
          return gifa11yOff.trim().length > 0 ? document.querySelector(gifa11yOff) : false;
        };
        if (!checkRunPrevent()) {
          document.addEventListener('DOMContentLoaded', () => {
            // Find and cache GIFs
            findGifs($gifs, option);

            // If there are GIFs on the page, load styles.
            if ($gifs.length) {
              generateStyle(option);
            }

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

  return Gifa11y;

}));
