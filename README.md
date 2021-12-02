# Gifa11y
Easily add pause buttons to your GIFs. This script is intended for shorter GIFs that loop indefinitely. It only generates a still of the first frame.

- Automatic
  - Generates a still using `<canvas>` element
  - No need to upload png/jpeg "still" of GIF
- Accessible
  - Keyboard accessible
  - Unique accessible names for buttons based on alt text
  - Large target size (50px by 50px)
  - Respects `prefers-reduced-motion` media query
- Vanilla JavaScript, no dependencies
  
▶️ [View Gifa11y demo](https://adamchaboryk.github.io/gifa11y/)... or [view demo on CodePen](https://codepen.io/adamchaboryk/pen/WNZbqNz) to see HTML before Gifa11y does its magic.
## Example installation
Refer to **Props** to easily customize.
  
````
<script src="/gifa11y.min.js"></script>
<script type="text/javascript">
    var gifa11y = new Gifa11y({
        container: 'main',
        buttonBackground: '#000000',
        buttonBackgroundHover: '#404040',
        buttonIconColor: 'white'
    });
</script>
````

## Props
### Colours, exclusions, and other features
|Property|Default|Description|
|---|---|---|
|`buttonBackground`|'indigo'|*String:* Any hexcode, rgb value, CSS colour keyword.|
|`buttonBackgroundHover`|'rebeccapurple'|*String:* Any hexcode, rgb value, CSS colour keyword.|
|`buttonIconColor`|'white'|*String:* Any hexcode, rgb value, CSS colour keyword.|
|`buttonFocusColor`|'#00e7ffad'|*String:* Any hexcode, rgb value, CSS colour keyword.|
|`container`|'body'|*String:* Add a pause button to GIFs within a specific area only. E.g. pass `main` for main content area.|
|`exclusions`|*' '*|*String:* Ignore specific GIFs or regions. Use commas to separate. E.g. `.jumbotron`|	
|`gifa11yOff`|*'.gifa11y-off'*|*String:* Don't run Gifa11y if page contains class/selector. E.g. `.authorMode`|
|`inheritClasses`|'true'|*Boolean:* If canvas element should inherit the same classes as the GIF.|
|`initiallyPaused`|'false'|*Boolean:* If you want *all* GIFs to be paused at first.|
|`missingAltWarning`|'true'|*Boolean:* warn content author if they are missing an alt attribute on GIF. Appended to GIF.|

### Language / i18n
|Property|Default|Description|
|---|---|---|
|`langPause`|'Pause animation:'|*String:* Start of aria-label for each button.|
|`langPlay`|'Play animation:'|*String:* Start of aria-label for each button.|
|`langPauseAllButton`|'Pause all animations'|*String:* toggle all button.|
|`langPlayAllButton`|'Play all animations'|*String:* toggle all button.|
|`langMissingAlt`|'Missing image description.'|*String:* If alt is missing on GIF, this string populates the aria-label for the corresponding pause button.|
|`langAltWarning`|'&#9888; Please add alternative text to GIF.'|*String:* If GIF is missing alt text.|

## Optional features
    
### Ignore specific GIFs
To prevent certain GIFs from getting a pause button. You can either:
- Add `gifa11y-ignore` as a CSS class to your image. E.g. `<img src="gandalf.gif" class="gifa11y-ignore" ...`
- Rename your GIF and include the text `gifa11y-ignored` in the file name. E.g. `<img src="gandalf-gifa11y-ignored.gif" ...`
- Use `exclusions` prop. 

### Pause GIFs initially
For those who prefer reduced motion via system prefs, GIFs will automatically be paused on page load. Although if you'd like specific gifs to be paused initially on page load (without reduced motion enabled), you can either:
- Add `gifa11y-paused` as a CSS class to your image. E.g. `<img src="gandalf.gif" class="gifa11y-paused" ...`
- Rename your GIF and include the text `gifa11y-paused` in the file name. E.g. `<img src="gandalf-gifa11y-paused.gif" ...`
- Set `initiallyPaused` prop to `true`
  
### Toggle all GIFs button
A button to toggle *all* GIFs. Add ````<button id="gifa11y-all">Pause all animations</button>```` within your HTML.

#### Please note:
- This button has no CSS styling. BYO-CSS (Bring your own CSS). 
- Button becomes clickable only after GIFs have fully loaded. Uses `disabled` attribute while page is loading. 

## Colophon
I was looking for a simple solution to automatically add pause buttons to GIFs, although I could not find anything that was 100% automatic, accessible, and considered loading time of images. I came across a few clever methods which involve swapping a `.jpg` still - although ain't nobody got time for that. This script uses the `<canvas>` method to generate a still. I learned a few things developing this:
- **Canvas element:** I came across the `canvas` method in a couple CodePens like this one by [hoanghals](https://codepen.io/hoanghals/pen/dZrWLZ). This specific pen is a bit more fancy as it relies on another library by [Buzzfeed called libgif-js](https://github.com/buzzfeed/libgif-js) to generate stills at various frames. I also learned that [`canvas` calculates from half a pixel](https://stackoverflow.com/a/13879402). So you need to add `0.5` pixels when generating a `canvas` still, otherwise you will notice a *slight* content shift. 
- **Timing**: Timing is **very** important... Images must load completely before you can determine height/width. If image is not completely done loading, then `clientWidth` will return `0`. Image dimensions are needed to generate a still using `<canvas>`. For this reason, pause buttons are generated *after* each image is done loading. If you have multiple images on a page, you'll notice that this process takes time. GIFs won't be instantly paused if you have `prefers-reduced-motion` enabled or use the `initiallyPaused` prop - you may notice a slight delay depending on your internet speed.
- To help make gifa11y easily customizable, I referenced this great tutorial: [How to create a framework-agnostic Javascript plugin by Sodeeq Elusoji.](https://blog.logrocket.com/how-to-create-a-framework-agnostic-javascript-plugin/)                                                                     

If you need a more comprehensive solution to deal with various types of animations, I recommend checking out Scott Vinkle's [Togglific!](https://svinkle.github.io/togglific/)
