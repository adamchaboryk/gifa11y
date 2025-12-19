import everythingToggle from './logic/everythingToggle.js';
import findGifs from './logic/findGifs.js';
import { Gifa11yButton, generateButtons } from './logic/generateButtons.js';
import generateStill from './logic/generateStill.js';
import toggleAll from './logic/toggleAll';

export default class Gifa11y {
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
        document.addEventListener(
          'DOMContentLoaded',
          () => {
            this.findNew();

            // Initialize toggle everything button.
            everythingToggle(option);
          },
          false,
        );
      }
    };
    this.initialize();
  }
}
