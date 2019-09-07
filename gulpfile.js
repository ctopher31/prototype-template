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

// Build JS ----------------------------------
const jsBuildTask = async (bundleName, bundle, wpConfig, updateFilename) => {
  const {
    build,
    dest,
    filename,
    files,
    tests,
    version,
    watch,
  } = bundle;

  const linterResults = await lintJs(watch).catch(error => console.log(error));
  const testResults = await testJs(tests).catch(error => console.log(error));

  if (linterResults.success && testResults.success) {
    let changedFiles;

    // Build the bundle
    const buildResults = await buildJs(bundle, wpConfig).catch(error => console.log(error));

    // Update the cache parameter in the filename in the view
    if (updateFilename) {
      const filenameRegex = RegExp(`${filename}\\.v([\\d.-]+)\\.min\\.js(\\?cache=([\\d]+)|)`, 'g');
      changedFiles = await replace({
        files,
        from: filenameRegex,
        to: `${filename}.v${version}-${build}.min.js?cache=${new Date().getTime()}`,
      }).catch(error => console.log(error));
    }

    // Log the ouput of the build
    console.log(chalk.cyan('Modified Files:', (changedFiles !== undefined ? changedFiles.join(',') : '')));
    console.log(`${buildResults.stats.toString({ colors: true })}\n`);
    console.log(chalk.green(`Output destination: ${path.resolve(dest)}`));
    console.log(chalk.cyan(`${bundleName} has finished running. ${new Date().toLocaleTimeString()}`));
    browserSync.reload(`${filename}.v${version}-${build}.min.js`);
    console.log('\n');
  } else {
    console.log(linterResults.formatted);
    console.log(chalk.yellow(linterResults ? '' : `Linter Failed, ${bundleName} was not built`));
    console.log(chalk.yellow(testResults.success ? '' : `Tests Failed, ${bundleName} was not built`));
  }
};

gulp.task('buildBundleJs', () => jsBuildTask('buildBundleJs', bundleJs, webpackConfig, true));

gulp.task('buildPolyfillJs', () => jsBuildTask('buildPolyfillJs', polyfillJs, webpackConfig, true));

gulp.task('buildClientRenderJs', () => jsBuildTask('buildClientRenderJs', clientRenderJs, webpackClientConfig, true));

gulp.task('buildServerSideRenderJs', () => jsBuildTask('buildServerSideRenderJs', serverSideRenderJs, webpackServerConfig, false));

// gulp.task('buildVisualizationJs', () => jsBuildTask('buildVisualizationJs', visualizationJs, webpackClientConfig, true));

// Build Sass ----------------------------------
const sassBuildTask = async (bundleName, bundle, updateFilename) => {
  const {
    build,
    dest,
    filename,
    files,
    version,
    watch,
  } = bundle;

  const linterResults = await stylelint.lint({
    cache: true,
    configFile: '.stylelintrc.json',
    files: watch,
    formatter: 'verbose',
    syntax: 'scss',
  }).catch(error => console.log(error));
  console.log(linterResults.output);

  if (!linterResults.errored) {
    let changedFiles;

    // Compile Sass
    await buildSass(bundle).catch(error => console.log(error));

    // Update the cache parameter in the filename in the view
    if (updateFilename) {
      const filenameRegex = RegExp(`${filename}\\.v([\\d.-]+)\\.min\\.css(\\?cache=([\\d]+)|)`, 'g');
      changedFiles = await replace({
        files,
        from: filenameRegex,
        to: `${filename}.v${version}-${build}.min.css?cache=${new Date().getTime()}`,
      }).catch(error => console.log(error));
    }

    // Log the ouput of the build
    console.log(chalk.cyan('Modified Files:', (changedFiles !== undefined ? changedFiles.join(',') : '')));
    console.log(chalk.green(`Output destination: ${path.resolve(dest)}`));
    console.log(chalk.cyan(`${bundleName} has finished running. ${new Date().toLocaleTimeString()}`));
    console.log(chalk.green(path.join(__dirname, `${dest}/${filename}.v${version}-${build}.min.css`)));
    console.log(chalk.green(path.join(__dirname, `${dest}/${filename}.v${version}-${build}.min.css.map`)));
    browserSync.reload(`${filename}.v${version}-${build}.min.css`);
    console.log('\n');
  } else {
    console.log(`There are CSS errors. Stylesheet did NOT build! Please fix your CSS errors. ${new Date().toLocaleTimeString()}`);
  }
};

gulp.task('buildBundleSass', () => sassBuildTask('BundleSass', bundleSass, true));

// gulp.task('buildVisualizationSass', () => sassBuildTask('VisualizationSass', visualizationSass, true));

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

gulp.task('default', ['watch'], () => {
  console.log('Gulp started');

  nodemon({
    env: {
      NODE_ENV: 'development',
    },
    inspect: true,
    ext: 'js, json',
    ignore: [
      '.git',
      'gulpfile.js',
      'node_modules/',
      'assets/',
    ],
    script: 'server.js',
    verbose: true,
    watch: [
      'server.js',
      'config/**/*.js',
      'routes/**/*.js',
      'controllers/**/*.js',
      'models/**/*.js',
    ],
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
      // adjust this time as needed to keep browsersync from hanging up
      setTimeout(() => browserSync.reload(), 300);
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

gulp.task('watch', () => {
  gulp.watch(bundleJs.watch, ['buildBundleJs']).on('change', () => console.log('Bundle JS Changed!'));

  gulp.watch(polyfillJs.watch, ['buildPolyfillJs']).on('change', () => console.log('Polyfill JS Changed!'));

  gulp.watch(clientRenderJs.watch, ['buildClientRenderJs']).on('change', () => console.log('ClientRender JS Changed!'));

  gulp.watch(serverSideRenderJs.watch, ['buildServerSideRenderJs']).on('change', () => console.log('ServerSideRender JS Changed!'));

  gulp.watch(config.paths.js.tests).on('change', () => console.log('Test JS Run!'));

  gulp.watch(bundleSass.watch, ['buildBundleSass']).on('change', () => console.log('Styles CSS Changed!'));

  gulp.watch(config.paths.nunjucks.source).on('change', () => {
    console.log('Nunjucks changed!');
    browserSync.reload();
  });
});

module.exports = gulp;
