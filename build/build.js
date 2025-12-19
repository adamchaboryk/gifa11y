import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { injectCSSintoJS } from './utils.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const pkg = JSON.parse(fs.readFileSync(path.resolve(dirname, '../package.json'), 'utf-8'));

/* Adds copyright banner AFTER minification. */
const addBanner = () => {
  const banner = `/*! Gifa11y ${pkg.version} | @author Adam Chaboryk © 2021 - ${new Date().getFullYear()} | @license MIT | @contact adam@chaboryk.xyz | https://github.com/adamchaboryk/gifa11y */`;
  return {
    name: 'add-banner',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName];
        // Only add banner to JS chunks (excludes CSS or assets)
        if (file.type === 'chunk') {
          file.code = banner.trim() + '\n' + file.code;
        }
      }
    },
  };
};

// Shared define.
const getDefine = () => ({
  'process.env.NODE_ENV': JSON.stringify('production'),
  Gifa11yVersion: JSON.stringify(pkg.version),
});

/* Helper to run a Vite build instance. */
const runBuild = async (config) => {
  await build({
    configFile: false,
    logLevel: 'info',
    ...config,
  });
};

/* ******************************************************** */
/* BUILD EXECUTION                                          */
/* ******************************************************** */
(async () => {
  console.log(`\n🚀 Starting build process for version ${pkg.version}\n`);

  // Core library.
  const mainEntry = path.resolve(dirname, '../src/js/gifa11y.js');

  // ESM - Unminified
  await runBuild({
    define: getDefine(),
    plugins: [
      injectCSSintoJS(),
      addBanner(),
    ],
    build: {
      emptyOutDir: false,
      minify: false,
      outDir: 'dist/js',
      lib: { entry: mainEntry, formats: ['es'], fileName: () => 'gifa11y.esm.js' },
    },
  });

  // ESM - Minified (using esbuild)
  await runBuild({
    define: getDefine(),
    plugins: [
      injectCSSintoJS(),
      addBanner(),
    ],
    build: {
      emptyOutDir: false,
      minify: true,
      outDir: 'dist/js',
      lib: { entry: mainEntry, formats: ['es'], fileName: () => 'gifa11y.esm.min.js' },
    },
  });

  // UMD - Unminified
  await runBuild({
    define: getDefine(),
    plugins: [
      injectCSSintoJS(),
      addBanner(),
    ],
    build: {
      emptyOutDir: false,
      minify: false,
      outDir: 'dist/js',
      lib: { entry: mainEntry, formats: ['umd'], name: 'Gifa11y', fileName: () => 'gifa11y.umd.js' },
    },
  });

  // UMD - Minified
  await runBuild({
    define: getDefine(),
    plugins: [
      injectCSSintoJS(),
      addBanner(),
    ],
    build: {
      emptyOutDir: false,
      minify: true,
      outDir: 'dist/js',
      lib: { entry: mainEntry, formats: ['umd'], name: 'Gifa11y', fileName: () => 'gifa11y.umd.min.js' },
    },
  });

  console.log('\n✨ Build complete!\n');
})();