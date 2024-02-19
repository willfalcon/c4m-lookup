const { src, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const postCSSPlugins = [autoprefixer(), cssnano()];

const styleScript = (srcFile, destFile, dev = false) =>
  dev
    ? src(srcFile)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest(destFile))
        .pipe(livereload())
    : src(srcFile)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postCSSPlugins))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write())
        .pipe(dest(destFile));

module.exports = styleScript;
