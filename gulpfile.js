// Gulpfile
const gulp = require('gulp');
const path = require('path');
const chalk = require('chalk');
const replace = require('replace-in-file');
const stylelint = require('stylelint');
const nodemon = require('nodemon');
const browserSync = require('browser-sync').create();
const { buildJs, buildSass, lintJs, testJs, buildTemplates } = require('./config/task-util');
const config = require('./config/project-config');
const webpackConfig = require('./config/webpack.config');
const webpackClientConfig = require('./config/webpack.react-client.config');
const webpackServerConfig = require('./config/webpack.react-server.config');

/* eslint-disable no-console */

const {
  bundleJs,
  polyfillJs,
  clientRenderJs,
  serverSideRenderJs,
} = config.paths.js;

const {
  bundleSass,
} = config.paths.sass;

gulp.task('build', ['buildBundleJs', 'buildBundleSass']);

// Build JS ----------------------------------
gulp.task('buildBundleJs', async () => {
  const {
    build,
    dest,
    files,
    tests,
    version,
    watch,
  } = bundleJs;

  const linterResults = await lintJs(watch).catch(error => console.log(error));
  const testResults = await testJs(tests).catch(error => console.log(error));

  if (linterResults.success && testResults.success) {
    const buildResults = await buildJs(bundleJs, webpackConfig).catch(error => console.log(error));
    const changedFiles = await replace({
      files,
      from: /app\.([v\d.-]+)\.min\.js/g,
      to: `app.v${version}-${build}.min.js`,
    }).catch(error => console.log(error));
    console.log('Modified Files:', changedFiles.join(','));
    console.log(`${buildResults.stats.toString({ colors: true })}\n`);
    console.log(`Output destination: ${path.resolve()}/${dest}`);
    console.log(`Bundle JS Built! ${new Date().toLocaleTimeString()}`);
    browserSync.reload('*.js');
  } else {
    console.log(linterResults.formatted);
    console.log(linterResults ? '' : 'Linter Failed, BundleJs was not built');
    console.log(testResults.success ? '' : 'Tests Failed, BundleJs was not built');
  }
});

gulp.task('buildPolyfillJs', async () => {
  const {
    build,
    dest,
    files,
    tests,
    version,
    watch,
  } = polyfillJs;

  const linterResults = await lintJs(watch).catch(error => console.log(error));
  const testResults = await testJs(tests).catch(error => console.log(error));

  if (linterResults.success && testResults.success) {
    const buildResults = await buildJs(polyfillJs, webpackConfig).catch(error => console.log(error));
    const changedFiles = await replace({
      files,
      from: /polyfill\.([v\d.-]+)\.min\.js/g,
      to: `polyfill.v${version}-${build}.min.js`,
    }).catch(error => console.log(error));
    console.log('Modified Files:', changedFiles.join(','));
    console.log(`${buildResults.stats.toString({ colors: true })}\n`);
    console.log(`Output destination: ${path.resolve()}/${dest}`);
    console.log(`Polyfill JS Built! ${new Date().toLocaleTimeString()}`);
    browserSync.reload('*.js');
  } else {
    console.log(linterResults.formatted);
    console.log(linterResults ? '' : 'Linter Failed, PolyfillJs was not built');
    console.log(testResults.success ? '' : 'Tests Failed, PolyfillJs was not built');
  }
});

gulp.task('buildClientRenderJs', async () => {
  const {
    dest,
    tests,
    watch,
  } = clientRenderJs;

  const linterResults = await lintJs(watch).catch(error => console.log(error));
  const testResults = await testJs(tests).catch(error => console.log(error));

  if (linterResults.success && testResults.success) {
    const buildResults = await buildJs(clientRenderJs, webpackClientConfig).catch(error => console.log(error));
    console.log(`${buildResults.stats.toString({ colors: true })}\n`);
    console.log(`Output destination: ${path.resolve()}/${dest}`);
    console.log(`ClientRender JS Rebuilt! ${new Date().toLocaleTimeString()}`);
    browserSync.reload('*.js');
  } else {
    console.log(linterResults.formatted);
    console.log(linterResults ? '' : 'Linter Failed, SwatchOrderingJs was not built');
    console.log(testResults.success ? '' : 'Tests Failed, SwatchOrderingJs was not built');
  }
});

gulp.task('buildServerSideRenderJs', async () => {
  const {
    dest,
    tests,
    watch,
  } = serverSideRenderJs;

  const linterResults = await lintJs(watch).catch(error => console.log(error));
  const testResults = await testJs(tests).catch(error => console.log(error));

  if (linterResults.success && testResults.success) {
    const buildResults = await buildJs(serverSideRenderJs, webpackServerConfig).catch(error => console.log(error));
    console.log(`${buildResults.stats.toString({ colors: true })}\n`);
    console.log(`Output destination: ${path.resolve()}/${dest}`);
    console.log(`ServerSideRender JS Rebuilt! ${new Date().toLocaleTimeString()}`);
    browserSync.reload('*.js');
  } else {
    console.log(linterResults.formatted);
    console.log(linterResults ? '' : 'Linter Failed, SwatchOrderingJs was not built');
    console.log(testResults.success ? '' : 'Tests Failed, SwatchOrderingJs was not built');
  }
});

// Build Sass ----------------------------------
gulp.task('buildBundleSass', async () => {
  const {
    build,
    dest,
    filename,
    files,
    version,
    watch,
  } = bundleSass;

  const linterResults = await stylelint.lint({
    cache: true,
    configFile: '.stylelintrc.json',
    files: watch,
    formatter: 'verbose',
    syntax: 'scss',
  }).catch(error => console.log(error));
  console.log(linterResults.output);
  if (!linterResults.errored) {
    await buildSass(bundleSass).catch(error => console.log(error));
    const changedFiles = await replace({
      files,
      from: /styles\.([v\d.-]+)\.min\.css/g,
      to: `styles.v${version}-${build}.min.css`,
    }).catch(error => console.log(error));
    console.log('Modified Files:', changedFiles.join(','));
    console.log(`Output destination: ${path.resolve()}/${dest}`);
    console.log(`Bundle CSS Built! ${new Date().toLocaleTimeString()}`);
    console.log(chalk.green(path.join(__dirname, `${dest}/${filename}.v${version}-${build}.min.css`)));
    console.log(chalk.green(path.join(__dirname, `${dest}/${filename}.v${version}-${build}.min.css.map`)));
    browserSync.reload('*.css');
    console.log('\n');
  } else {
    console.log(`There are CSS errors. Stylesheet did NOT build! Please fix your CSS errors. ${new Date().toLocaleTimeString()}`);
  }
});

// Build Templates ----------------------------------
gulp.task('buildNunjucks', async () => {
  const {
    source,
    templates,
    dest,
  } = config.paths.nunjucks;

  await buildTemplates(source, templates, dest).catch(err => console.log(err));
  console.log('HTML (Nunjucks) Templates Built!');
  browserSync.reload('*.html');
});

gulp.task('watch', ['serve', 'watchBundleSass', 'watchBundleJs', 'watchTestJs']);

gulp.task('watchBundleJs', () => gulp.watch(bundleJs.watch, ['buildBundleJs']).on('change', () => console.log('Bundle JS Changed!')));

gulp.task('watchPolyfillJs', () => gulp.watch(polyfillJs.watch, ['buildPolyfillJs']).on('change', () => console.log('Polyfill JS Changed!')));

gulp.task('watchClientRenderJs', () => gulp.watch(clientRenderJs.watch, ['buildClientRenderJs']).on('change', () => console.log('ClientRender JS Changed!')));

gulp.task('watchServerSideRenderJs', () => gulp.watch(serverSideRenderJs.watch, ['buildServerSideRenderJs']).on('change', () => console.log('ServerSideRender JS Changed!')));

gulp.task('watchTestJs', () => gulp.watch(config.paths.js.tests).on('change', () => console.log('Test JS Run!')));

gulp.task('watchBundleSass', () => gulp.watch(bundleSass.watch, ['buildBundleSass']).on('change', () => console.log('Styles CSS Changed!')));

gulp.task('serve', () => {
  nodemon({
    env: {
      NODE_ENV: 'development',
    },
    ext: 'js, json',
    ignore: [
      '.git',
      'gulpfile',
      'node_modules',
      'assets',
    ],
    script: 'server.js',
    verbose: true,
  });

  browserSync.init({
    logLevel: 'debug',
    online: false,
    open: false,
    port: 4002,
    proxy: 'localhost:3002',
    ui: false,
  });

  nodemon.on('start', () => {
    console.log('App started');
    if (browserSync.paused) {
      browserSync.resume();
      browserSync.reload();
    }
  }).on('quit', () => {
    browserSync.exit();
    console.log('App has quit');
    process.exit();
  }).on('restart', (files) => {
    console.log('App restarted due to: ', files);
    browserSync.pause();
  });
});

gulp.task('default', ['build', 'watch'], () => console.log('Gulp started'));

module.exports = gulp;
