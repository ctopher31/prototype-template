// Task Functions for Task Runner
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import eslint from 'gulp-eslint';
import styleLint from 'gulp-stylelint';
import cache from 'gulp-cached';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mocha from 'gulp-mocha';
import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import chalk from 'chalk';
import named from 'vinyl-named';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import nunjucksRender from 'gulp-nunjucks-render';
import browserSync from 'browser-sync';

browserSync.create();

const runServer = () => browserSync.init({
  logLevel: 'debug',
  port: 3002,
  server: {
    baseDir: './dist/',
  },
  ui: {
    port: 4002,
    weinre: {
      port: 9002,
    },
  },
});

const mapError = (err) => {
  if (err.fileName) {
    gutil.log(`${chalk.red(err.name)} : ${chalk.yellow(err.fileName.replace(path.join(__dirname, '/Assets/Scripts/src/'), ''))} : Line ${chalk.magenta(err.lineNumber)} & Column ${chalk.magenta(err.columnNumber || err.column)} : ${chalk.blue(err.description)}`);
  } else {
    gutil.log(`${chalk.red(err.name)} : ${chalk.yellow(err.message)}`);
  }
};

const buildJsPromised = ({ source, dest, filename, version, build }, webpackConfigs = []) => webpackConfigs.map(webpackConfig => gulp.src(source)
  .pipe(named())
  .pipe(webpackStream(Object.assign({}, webpackConfig, {
    entry: {
      source,
    },
    output: {
      filename: `${filename}${webpackConfig.output.filename}.v${version}-${build}.min.js`,
    },
  }), webpack))
  .pipe(gulp.dest(dest))
  .on('error', mapError));

const buildJs = (obj, webpackConfigs = []) => new Promise((resolve, reject) => {
  try {
    resolve(buildJsPromised(obj, webpackConfigs));
  } catch (error) {
    reject(error, `Error resolving buildJs promise: ${error}`);
  }
});

const lintJs = src => gulp.src(src)
  .pipe(eslint())
  .pipe(eslint.format());

const testJs = src => gulp.src(src)
  .pipe(mocha({
    compilers: 'js:babel-core/register',
    require: './tests/setup.js',
  }));

const buildSassPromised = ({ source, dest, version, build }) => gulp.src(source)
  .pipe(sourcemaps.init({
    loadMaps: true,
  }))
  .pipe(sass({
    outputStyle: 'compressed',
  }).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(rename({ suffix: `.v${version}-${build}.min` }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(dest))
  .on('error', mapError);

const buildSass = obj => new Promise((resolve, reject) => {
  try {
    resolve(buildSassPromised(obj));
  } catch (error) {
    reject(error, `Error resolving buildSass promise: ${error}`);
  }
});

const lintScss = src => gulp.src(src)
  .pipe(cache('scsslint'))
  .pipe(styleLint({
    reporters: [
      { formatter: 'verbose', console: true },
    ],
    debug: true,
  }));

const buildTemplatesPromised = ({ source, dest, templates }) => gulp.src(source)
  .pipe(nunjucksRender({
    path: [templates],
  }))
  .pipe(gulp.dest(dest))
  .on('error', mapError)
  .pipe(browserSync.stream({ match: '**/*.html' }));

const buildTemplates = obj => new Promise((resolve, reject) => {
  try {
    resolve(buildTemplatesPromised(obj));
  } catch (error) {
    reject(error, `Error resolving buildSass promise: ${error}`);
  }
});

export {
  runServer,
  buildTemplates,
  buildJs,
  lintJs,
  testJs,
  buildSass,
  lintScss,
};
