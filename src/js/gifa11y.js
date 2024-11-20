import findGifs from './logic/findGifs.js';
import generateStill from './logic/generateStill.js';
import { Gifa11yButton, generateButtons } from './logic/generateButtons.js';
import toggleEverything from './logic/toggleEverything.js';

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
