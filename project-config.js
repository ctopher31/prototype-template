// Project Config for Task Runner
const config = {
  paths: {
    sass: {
      bundleSass: {
        source: './src/scss/styles.scss',
        watch: ['./src/scss/styles.scss', './src/scss/base/**/*.scss', './src/scss/layout/**/*.scss', './src/scss/modules/**/*.scss', './src/scss/state/**/*.scss'],
        dest: './dist/css',
        filename: 'styles',
        version: '1.0',
        build: '1',
        files: [],
      },
    },
    js: {
      watch: './src/js/**/*.js',
      bundleJs: {
        source: './src/js/app.js',
        watch: ['./src/js/app.js', './src/js/modules/**/*.js'],
        dest: './dist/js',
        filename: 'app',
        version: '1.0',
        build: '1',
        files: [],
        tests: ['./tests/test.spec.js'],
      },
      polyfillJs: {
        source: './src/js/polyfill.js',
        watch: ['./src/js/polyfill.js'],
        dest: './dist/js',
        filename: 'polyfill',
        version: '1.0',
        build: '1',
        files: [],
        tests: '',
      },
      tests: ['./tests/**/*.spec.js'],
    },
    nunjucks: {
      templates: './src/templates',
      source: './src/pages/**/*.+(html|njk)',
      dest: './dist',
      watch: ['./src/pages/**/*.+(html|njk)', './src/templates/**/*.+(html|njk)'],
    },
  },
};

export default config;
