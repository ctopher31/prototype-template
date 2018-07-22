// Project Config for Task Runner
const config = {
  paths: {
    sass: {
      bundleSass: {
        source: './assets/src/scss/styles.scss',
        watch: ['./assets/src/scss/styles.scss', './assets/src/scss/base/**/*.scss', './assets/src/scss/layout/**/*.scss', './assets/src/scss/modules/**/*.scss', './assets/src/scss/state/**/*.scss'],
        dest: './assets/dist/css',
        filename: 'styles',
        version: '1-0',
        build: '1',
        files: [],
      },
    },
    js: {
      watch: './assets/src/js/**/*.js',
      bundleJs: {
        source: './assets/src/js/app.js',
        watch: ['./assets/src/js/app.js', './assets/src/js/modules/**/*.js'],
        dest: './assets/dist/js',
        filename: 'app',
        version: '1-0',
        build: '1',
        files: [],
        tests: ['./tests/test.spec.js'],
      },
      polyfillJs: {
        source: './assets/src/js/polyfill.js',
        watch: ['./assets/src/js/polyfill.js'],
        dest: './assets/dist/js',
        filename: 'polyfill',
        version: '1-0',
        build: '1',
        files: [],
        tests: '',
      },
      clientRenderJs: {
        source: './assets/src/js/client.js',
        dest: './assets/dist/js',
        watch: ['./assets/src/js/client.js', './assets/src/js/actions/**/*.js', './assets/src/js/reducers/**/*.js', './assets/src/js/middleware/**/*.js', './assets/src/js/components/**/*.{js,jsx}'],
        filename: 'client',
        version: '1-0',
        build: '1',
        files: [],
        tests: '',
      },
      serverSideRenderJs: {
        source: './assets/src/js/server.js',
        dest: './assets/dist/js',
        watch: ['./assets/src/js/server.js', './assets/src/js/components/**/*.{js,jsx}'],
        filename: 'server',
        version: '1-0',
        build: '1',
        files: [],
        tests: '',
      },
      tests: ['./tests/**/*.spec.js'],
    },
    nunjucks: {
      templates: './views/templates',
      source: './views/pages/**/*.+(html|njk)',
      dest: './assets/dist/html',
      watch: ['./views/pages/**/*.+(html|njk)', './views/templates/**/*.+(html|njk)'],
    },
  },
};

export default config;
