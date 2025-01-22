import findGifs from './logic/findGifs.js';
import generateStill from './logic/generateStill.js';
import { Gifa11yButton, generateButtons } from './logic/generateButtons.js';
import everythingToggle from './logic/everythingToggle.js';

export default class Gifa11y {
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
      buttonPauseShared: false,
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
      useDevicePixelRatio: false,
    };
    const option = { ...defaultConfig, ...options };
    window.gifa11yOption = option;

    window.a11ygifs = [];

    this.findNew = function() {

      const $newGifs = [];
      // Find and cache GIFs
      findGifs($newGifs, option);

      // Iterate through all GIFs after they finish loading.
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
    }

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
          this.findNew();
          // Initialize toggle everything button.
          everythingToggle(option);
        }, false);
      }
    };
    this.initialize();
  }
}
