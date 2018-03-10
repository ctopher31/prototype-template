import gulp from 'gulp';
// import replace from 'replace-in-file';
import { runServer, buildTemplates, buildJs, buildSass, lintScss, lintJs, testJs } from './task-util';
import config from './project-config';
import webpackConfig from './webpack.config';

const {
  bundleJs,
  polyfillJs,
} = config.paths.js;

const {
  bundleSass,
} = config.paths.sass;

gulp.task('build', ['buildNunjucks', 'buildBundleJs', 'buildBundleSass']);

gulp.task('buildBundleJs', () => buildJs(bundleJs, [webpackConfig])
  .then(() => {
    const {
      // files,
      watch,
      // version,
      // build,
      tests,
    } = bundleJs;

    console.log(`Bundle JS Built! ${new Date().toLocaleTimeString()}`);
    lintJs(watch);
    testJs(tests);
    // replace({
    //   files,
    //   from: /app\.([v\d\.-]+)\.min\.js/g,
    //   to: `app.v${version}-${build}.min.js`,
    // })
    // .then(changedFiles => console.log('Modified Files:', changedFiles.join(',')));
  })
  .catch(error => console.log(error)));

gulp.task('buildPolyfillJs', () => buildJs(polyfillJs, [webpackConfig])
  .then(() => {
    const {
      // files,
      watch,
      // version,
      // build,
    } = polyfillJs;

    console.log(`Polyfill JS Built! ${new Date().toLocaleTimeString()}`);
    lintJs(watch);
    // replace({
    //   files,
    //   from: /polyfill\.([v\d\.-]+)\.min\.js/g,
    //   to: `polyfill.v${version}-${build}.min.js`,
    // })
    // .then(changedFiles => console.log('Modified Files:', changedFiles.join(',')));
  })
  .catch(error => console.log(error)));

gulp.task('buildBundleSass', () => buildSass(bundleSass)
  .then(() => {
    const {
      // files,
      watch,
      // version,
      // build,
    } = bundleSass;

    console.log(`Styles CSS Built! ${new Date().toLocaleTimeString()}`);
    lintScss(watch);
    // replace({
    //   files,
    //   from: /balistyles\.([v\d\.-]+)\.min\.css/g,
    //   to: `balistyles.v${version}-${build}.min.css`,
    // })
    // .then(changedFiles => console.log('Modified Files:', changedFiles.join(',')));
  })
  .catch(error => console.log(error)));

gulp.task('buildNunjucks', () => buildTemplates(config.paths.nunjucks)
  .then(() => console.log('HTML (Nunjucks) Templates built!'))
  .catch(error => console.log(error)));

gulp.task('watch', ['watchNunjucks', 'watchBundleSass', 'watchBundleJs', 'watchTestJs']);

gulp.task('watchBundleJs', () => gulp.watch(bundleJs.watch, ['buildBundleJs']).on('change', () => console.log('Bundle JS Changed!')));

gulp.task('watchPolyfillJs', () => gulp.watch(polyfillJs.watch, ['buildPolyfillJs']).on('change', () => console.log('Polyfill JS Changed!')));

gulp.task('watchTestJs', () => gulp.watch(config.paths.js.tests).on('change', () => console.log('Test JS Run!')));

gulp.task('watchBundleSass', () => gulp.watch(bundleSass.watch, ['buildBundleSass']).on('change', () => console.log('Styles CSS Changed!')));

gulp.task('watchNunjucks', () => gulp.watch(config.paths.nunjucks.watch, ['buildNunjucks']).on('change', () => console.log('HTML (Nunjucks) Templates Changed!')));

gulp.task('serve', () => runServer());

gulp.task('default', ['build', 'serve', 'watch'], () => console.log('Gulp started'));

module.exports = gulp;
