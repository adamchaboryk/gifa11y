import styles from '../../../dist/css/gifa11y.min.css';

export default function generateStyle(option) {
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
