import gulp from 'gulp';
const { src, dest, watch, series } = gulp;
import gulpSass from "gulp-sass";
import * as sassEmbedded from "sass";
const sass = gulpSass(sassEmbedded);
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';
import postcss from 'gulp-postcss';
const browserSync = require('browser-sync').create();
import purgecss from 'gulp-purgecss';
import terser from "gulp-terser";
import concat from "gulp-concat";


/* Sass Task */
function scssTask() {
  return src('./scss/style.scss', { sourcemaps: true }) // Source file
    .pipe(sass().on('error', sass.logError)) // Compile Sass
    .pipe(purgecss({
      content: ['*.html'] // Remove unused CSS
    }))
    .pipe(postcss([
      postcssPresetEnv({
        stage: 3,
        features: {
          "logical-properties-and-values": false,
          "opacity-percentage": true,
          "text-decoration-shorthand": true,
        }
      }), // Use postcss-preset-env with stage 1 features
      autoprefixer(), // Add vendor prefixes
      cssnano() // Minify CSS
    ]))
    .pipe(dest('./dist/css', { sourcemaps: '.' })) // Write sourcemaps
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

/* Js Task */
function jsTask() {
  return src('./js/*.js', { sourcemaps: true }) // Source file
    .pipe(init())
    .pipe(terser())
    .pipe(concat('main.js'))
    .pipe(write('.'))
    .pipe(dest('dist/js', { sourcemaps: '.' })) // Write sourcemaps;
}


/* Browsersync Task */
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

/* Browsersync reload when files saved */
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

/* Watch Task */
function watchTask() {
  watch(['./scss/**/*.scss', './js/**/*.js', '*.html'], series(scssTask, jsTask, browserSyncReload));
}

const _default = series(
  scssTask,
  jsTask,
  browserSyncServe,
  watchTask
);
export { _default as default };