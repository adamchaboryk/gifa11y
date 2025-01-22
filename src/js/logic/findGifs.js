export default function findGifs($newGifs, option) {
  // Find GIFs within specified container, fallback to 'body'.
  const root = document.querySelector(option.container);
  const container = (!root) ? document.querySelector('body') : root;

  // Check for additional images supplied through instantiation.
  const additionalImages = (!option.target) ? '' : `, ${option.target}`;
  const exclusions = (!option.exclusions) ? '' : `, ${option.exclusions}`;

  // Query DOM for images.
  const images = Array.from(container.querySelectorAll(`:is(img[src$=".gif"]${additionalImages}):not([src*="gifa11y-ignore"], [data-gifa11y-state], .gifa11y-ignore${exclusions})`));

  // Update $gifs array.
  images.forEach(($gif) => {
    $newGifs.push($gif);
  });
}
