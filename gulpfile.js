import gulp from 'gulp';
const { src, dest, watch, series } = 'gulp';
import gulpSass from "gulp-sass";
import * as sassEmbedded from "sass";
const sass = gulpSass(sassEmbedded);
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'gulp-postcss';
const browserSync = require('browser-sync').create();
import purgecss from 'gulp-purgecss';
import terser from "gulp-terser";
import concat from "gulp-concat";


/* Sass Task */
function scssTask() {
  return src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(purgecss({
      content: ['*.html']
    }))
    .pipe(postcss([autoprefixer, cssnano()]))
    .pipe(dest('./dist/css', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

/* Js Task */
function jsTask() {
  return src('app/js/*.js')
    .pipe(init())
    .pipe(terser())
    .pipe(concat('main.js'))
    .pipe(write('.'))
    .pipe(dest('dist/js'));
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
  watch(['./scss/**/*.scss', '*.html'], series(scssTask, browserSyncReload));
}

const _default = series(
  scssTask,
  browserSyncServe,
  watchTask
);
export { _default as default };