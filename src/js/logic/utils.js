/**
 * Detects if the browser supports CSS Anchor Positioning.
 * @link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
 */
export function supportsAnchorPositioning() {
  return CSS.supports('anchor-name: --gifa11y') && CSS.supports('position-anchor: --gifa11y');
}
