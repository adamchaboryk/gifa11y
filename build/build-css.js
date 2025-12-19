import fs from 'fs';
import path from 'path';
import { bundle, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

const srcDir = 'src/css';
const distDir = 'dist/css';
const targets = browserslistToTargets(browserslist('defaults, not IE 11'));

(async () => {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const filename = `gifa11y.css`;
  const inputPath = path.join(srcDir, filename);

  // Common config for bundling.
  const bundleConfig = {
    filename: inputPath,
    sourceMap: false,
    targets,
  };

  try {
    const unminified = bundle({
      ...bundleConfig,
      minify: false,
    });
    fs.writeFileSync(path.join(distDir, filename), unminified.code);

    const minified = bundle({
      ...bundleConfig,
      minify: true,
    });
    const minFilename = filename.replace('.css', '.min.css');
    fs.writeFileSync(path.join(distDir, minFilename), minified.code);
  } catch (err) {
    console.error(`❌ Error bundling ${filename}:`, err.message);
    process.exit(1);
  }
  console.log(`✅ Compiled CSS.`);
})();