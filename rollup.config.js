/* eslint-disable no-shadow */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import sass from 'rollup-plugin-sass';
import cssnano from 'cssnano';
import postcss from 'postcss';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import autoprefixer from 'autoprefixer';
import pkg from './package.json';

/* Copyright notice */
const banner = `/*! Gifa11y ${pkg.version} | @author Adam Chaboryk © 2021 - ${new Date().getFullYear()} | @license MIT | @contact adam@chaboryk.xyz | https://github.com/adamchaboryk/gifa11y */`;

/**
 * Reusable function to process SCSS files.
 * @param {string} input - Input SCSS file path.
 * @param {string} output - Output CSS file path.
 * @param {string} outputMin - Output minified CSS file path.
 * @returns {Promise<string>} - Empty string.
 */
const processSCSS = async (input, output, outputMin) => {
  const result = await postcss([autoprefixer]).process(input, { from: undefined });
  const path = `dist/css/${output}`;
  const pathMin = `dist/css/${outputMin}`;

  if (!existsSync(dirname(path))) {
    await mkdir(dirname(path), { recursive: true });
  }
  await writeFile(path, result.css, { encoding: 'utf8' });

  const minifiedResult = await postcss([cssnano]).process(result.css, { from: undefined });
  if (!existsSync(dirname(pathMin))) {
    await mkdir(dirname(pathMin), { recursive: true });
  }
  await writeFile(pathMin, minifiedResult.css, { encoding: 'utf8' });
  return '';
};

export default [
  {
    input: 'src/scss/gifa11y.scss',
    plugins: [
      sass({
        output: false,
        processor: (css) => processSCSS(css, 'gifa11y.css', 'gifa11y.min.css'),
      }),
    ],
  },
  // ES6 standalone files
  {
    input: 'src/js/gifa11y.js',
    plugins: [
      nodeResolve(),
      css(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
    output: [
      { banner, file: 'dist/js/gifa11y.esm.js', format: 'esm' },
      { banner, file: 'dist/js/gifa11y.esm.min.js', format: 'esm', plugins: [terser()] },
    ],
  },
  // UMD standalone files
  {
    input: 'src/js/gifa11y.js',
    plugins: [
      nodeResolve(),
      css(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
    output: [
      { banner, file: 'dist/js/gifa11y.umd.js', format: 'umd', name: 'Gifa11y' },
      { banner, file: 'dist/js/gifa11y.umd.min.js', format: 'umd', name: 'Gifa11y', plugins: [terser()] },
    ],
  },
];
