# Gifa11y
Easily add pause buttons to your gifs. This script is intended for shorter gifs that loop indefinitely. It only generates a still of the first frame.

[![npm version](https://badge.fury.io/js/gifa11y.svg)](https://www.npmjs.com/package/gifa11y)
![GitHub file size in bytes](https://img.shields.io/github/size/adamchaboryk/gifa11y/dist/js/gifa11y.umd.min.js)
![GitHub](https://img.shields.io/github/license/adamchaboryk/gifa11y)
![jsDelivr stats](https://data.jsdelivr.com/v1/package/gh/adamchaboryk/gifa11y/badge)

- Automatic
  - Generates a still using `<canvas>` element.
  - No need to upload png/jpeg "still" of gif.
- Accessible
  - Keyboard accessible.
  - Unique accessible names for buttons based on alt text.
  - Large target size (50px by 50px).
  - Respects `prefers-reduced-motion` media query.
- Vanilla JavaScript
- Customizable
  - Customize colours and icons via props.
  - Leverages web components to avoid style conflicts.
- Size: ~9.5 KB

▶️ [View Gifa11y demo](https://adamchaboryk.github.io/gifa11y/)

Alternatively check out [Gifa11y demo on CodePen](https://codepen.io/adamchaboryk/pen/WNZbqNz) to view HTML before Gifa11y does its magic. Experiment with different props and settings.

## Install

### CDN (regular script/UMD):
```
https://cdn.jsdelivr.net/gh/adamchaboryk/gifa11y@2.1.0/dist/js/gifa11y.umd.min.js
```

### NPM
```
npm i gifa11y
```

### Example install as regular script
Refer to **Props** to easily customize. CSS styles for buttons are bundled with JavaScript.

```
<script src="dist/js/gifa11y.umd.min.js"></script>
<script>
var gifa11y = new Gifa11y({
    container: 'main',
    buttonBackground: '#000000',
    buttonBackgroundHover: '#404040',
    buttonIconColor: 'white'
});
</script>
```

### Example install via modules
Refer to **Props** to easily customize.

```
<script type="module">
import Gifa11y from "../dist/js/gifa11y.esm.js";
const gifa11y = new Gifa11y({
  container: 'main',
  buttonBackground: '#000000',
  buttonBackgroundHover: '#404040',
  buttonIconColor: 'white'
});
</script>
```

### Example install for Eleventy (11ty)
Here's an example recipe for selectively adding Gifa11y to web pages that contain `.gif` images. This approach helps minimize HTTP requests and provides the flexibility to easily remove the library if necessary. For advanced usage, you can also install Gifa11y via npm and replace the CDN link to have Gifa11y inline on your page.

```
eleventyConfig.addTransform("gifa11y", async function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      if (content.includes("<img") && content.includes(".gif")) {
        const gifa11y =
          `<script src="https://cdn.jsdelivr.net/gh/adamchaboryk/gifa11y@2.1.0/dist/js/gifa11y.umd.min.js"></script>
          <script>
          // Customize props.
          const gifa11y = new Gifa11y({
            showGifText: true,
            buttonBackground: 'var(--background-secondary)',
            buttonBackgroundHover: 'var(--background)',
            buttonIconColor: 'var(--text)',
          });
        </script>`;
        content = content.replace("</body>", `${gifa11y}</body>`);
      }
    }
    return content;
  });
```

## Props
### Colours, exclusions, and other features
| Property | Default | Description |
|----------|---------|-------------|
| `buttonBackground`|`indigo`| **String:** Any hexcode, rgb value, CSS colour keyword.|
| `buttonBackgroundHover`|`rebeccapurple`| **String:** Any hexcode, rgb value, CSS colour keyword.|
| `buttonBorder`|`2px solid #fff`| **String:** Specify the style, width, and color of an element's border.|
| `buttonBorderRadius` | `50%` | **String:** Switch between round and square buttons. |
| `buttonIconColor` | `white` | **String:** Any hexcode, rgb value, CSS colour keyword. |
| `buttonFocusColor` | `#00e7ffad` | **String:** Any hexcode, rgb value, CSS colour keyword. |
| `buttonIconSize` | `1.5rem` | **String:** Adjust height and width of SVG. |
| `buttonIconFontSize` | `1rem` | **String:** Adjust `font-size` of an icon font (if passing an icon font via prop). E.g. `<i class="fas fa-play"></i>` |
| `buttonPlayIconID` | `''` | **String:** Supply your own play icon with an existing element on the page via it's unique `id`. |
| `buttonPauseIconID` | `''` | **String:** Supply your own pause icon with an existing element on the page via it's unique `id` |
| `buttonPlayIconHTML` | `''` | **String:** Supply your own play icon using an icon font or SVG. e.g. `<i class="fas fa-play"></i>` |
| `buttonPauseIconHTML` | `''` | **String:** Supply your own pause icon using an icon font or SVG. e.g. `<i class="fas fa-pause"></i>` |
| `container` | `body` | **String:** Add a pause button to gifs within a specific area only. E.g. pass `main` for main content area. |
| `exclusions` | `''` | **String:** Ignore specific gifs or regions. Use commas to separate. E.g. `.jumbotron` |
| `gifa11yOff` | `.gifa11y-off` | **String:** Don't run Gifa11y if page contains class/selector. For example, turn off in development environments. E.g. `.authorMode` |
| `inheritClasses` | `true` | **Boolean:** If canvas element should inherit the same classes as the gif. |
| `initiallyPaused` | `false` | **Boolean:** If you want *all* gifs to be paused at first. |
| `missingAltWarning` | `true` | **Boolean:** warn content author if they are missing an alt attribute on gif. Appended to gif. |
| `sharedPauseButton` | `false` | **Boolean:** Pausing any gif pauses all gifs. |
| `showButtons` | `true` | **Boolean:** Show or hide Play/Pause buttons. |
| `showGifText` | `false` | **Boolean:** Show or hide gif text within buttons. |
| `target` | `img[src$=".gif"]` | **String:** Using CSS selectors, target specific animated GIFs or .webp images, for example `target: 'img[src$=".gif"], img[src$=".webp"]'` |
| `useDevicePixelRatio` | `false` | **Boolean:** Use [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) property to help with [scaling for high resolution displays.](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays) |

### Language / i18n
|Property|Default|Description|
|---|---|---|
|`langPause`|`Pause animation:`|**String:** Start of aria-label for each button.|
|`langPlay`|`Play animation:`|**String:** Start of aria-label for each button.|
|`langPauseAllButton`|`Pause all animations`|**String:** toggle all button.|
|`langPlayAllButton`|`Play all animations`|**String:** toggle all button.|
|`langMissingAlt`|`Missing image description.`|**String:** If alt is missing on gif, this string populates the aria-label for the corresponding pause button.|
|`langAltWarning`|`Error! Please add alt text to gif.`|**String:** If gif is missing alt text.|

## Optional features

### Ignore specific gifs
To prevent certain gifs from getting a pause button. You can either:
1. Add `gifa11y-ignore` as a CSS class to your image.
    - For example: `<img src="gandalf.gif" class="gifa11y-ignore" />`

2. Rename your gif and include the text `gifa11y-ignored` in the file name.
    - For example: `<img src="gandalf-gifa11y-ignored.gif" />`

3. Identify gifs by selector and passing them via the `exclusions` prop.
    - For example: `exclusions: '.decorative-gif, header *'`

### Pause gifs initially
For those who prefer reduced motion via system prefs, gifs will automatically be paused on page load. Although if you'd like specific gifs to be paused initially on page load (without reduced motion enabled), you can either:
1. Add `gifa11y-paused` as a CSS class to your image.
    - For example: `<img src="gandalf.gif" class="gifa11y-paused" />`

2. Rename your gif and include the text `gifa11y-paused` in the file name.
    - For example: `<img src="gandalf-gifa11y-paused.gif" />`

3. Set `initiallyPaused` prop to `true`.

### Toggle all gifs button
A button to toggle *all* gifs. Add ````<button id="gifa11y-all"></button>```` within your HTML. The "toggle all animations" button has no CSS styling. BYO-CSS (Bring your own CSS). This button becomes clickable only after gifs have fully loaded. It uses the `disabled` attribute while page is loading.

### Synchronize states
- The `sharedPauseButton` prop makes all buttons act like the "Toggle all" button.
- Toggles dispatch events when clicked, allowing Gifa11y to sync its state with other libraries. E.g.:
```javascript
  // Listen for Gifa11y toggle events.
  window.addEventListener('gifa11yState', (e)=> {
    newState = e.detail.newState === 'paused';
    toggleMyOtherAnimations(newState);
  });

  // Programmatically play/pause Gifa11y.
  window.gifa11y.setAll(myOtherAnimationsPlaying ? 'playing' : 'paused');
```
### Find new Gifs
If you add new images to the page, tell Gifa11y to check again:
```javascript
window.gifa11y.findNew();
```

## Development
`npm i gifa11y`

A light server for development is included. Any change inside `/src` folder files will trigger the build process for the files and will reload the page with the new changes. To use this environment:

1. Clone this repo.
2. Be sure you have node installed and up to date.
3. Execute `npm install`
4. In a terminal execute: `npm run start`. Then open http://localhost:8080/docs/index.html in your browser.

## Colophon
I was looking for a simple solution to automatically add pause buttons to gifs, although I could not find anything that was 100% automatic, accessible, and considered loading time of images. I came across a few clever methods which involve swapping a `.jpg` still - although ain't nobody got time for that. This script uses the `<canvas>` method to generate a still. I learned a few things developing this:

- **Canvas element:** I came across the `canvas` method in a couple CodePens like this one by [hoanghals](https://codepen.io/hoanghals/pen/dZrWLZ). This specific pen is a bit more fancy as it relies on another library by [Buzzfeed called libgif-js](https://github.com/buzzfeed/libgif-js) to generate stills at various frames.

- **Timing**: Timing is **very** important... Images must load completely before you can determine height/width. If image is not completely done loading, then `clientWidth` will return `0`. Image dimensions are needed to generate a still using `<canvas>`. For this reason, pause buttons are generated *after* each image is done loading. If you have multiple images on a page, you'll notice that this process takes time. gifs won't be instantly paused if you have `prefers-reduced-motion` enabled or use the `initiallyPaused` prop - you may notice a slight delay depending on your internet speed.

- To help make gifa11y easily customizable, I referenced this great tutorial: [How to create a framework-agnostic Javascript plugin by Sodeeq Elusoji.](https://blog.logrocket.com/how-to-create-a-framework-agnostic-javascript-plugin/)

If you need a more comprehensive solution to deal with various types of animations, I recommend checking out Scott Vinkle's [Togglific!](https://svinkle.github.io/togglific/)
