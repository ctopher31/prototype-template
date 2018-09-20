// Task Functions for Task Runner
const path = require('path');
const fs = require('fs');
const { CLIEngine } = require('eslint');
const Mocha = require('mocha');
const webpack = require('webpack');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const nunjucks = require('nunjucks');

const buildJs = ({ source, dest, filename, version, build }, webpackConfig) => new Promise((resolve, reject) => {
  webpack(Object.assign({}, webpackConfig, {
    entry: {
      source,
    },
    output: {
      path: path.resolve(dest),
      filename: `${filename}.v${version}-${build}.min.js`,
    },
  }), (err, stats) => {
    if (err) {
      reject(new Error(`Error building Javascript: ${err}`));
    }
    resolve({
      stats,
    });
  });
});

const lintJs = src => new Promise((resolve, reject) => {
  try {
    const eslint = new CLIEngine({
      cache: true,
      useEslintrc: true,
    });
    const report = eslint.executeOnFiles(src);
    const formatter = eslint.getFormatter();
    resolve({
      report,
      success: report.errorCount === 0 || false,
      formatted: formatter(report.results),
    });
  } catch (reason) {
    reject(new Error(`Linting error: ${reason}`));
  }
});

const testJs = src => new Promise((resolve, reject) => {
  try {
    const mocha = new Mocha();
    [...src].map((file) => {
      delete require.cache[path.resolve(file)];
      return mocha.addFile(path.resolve(file));
    });
    mocha.run(failures => resolve({ success: failures === 0 || false }));
  } catch (reason) {
    reject(new Error(`Tests failed: ${reason}`));
  }
});

const buildSass = ({ source, dest, filename, version, build }) => new Promise((resolve, reject) => {
  sass.render({
    file: source,
    includePaths: ['./base', './layout', './modules', './state', './theme'],
    outFile: `${dest}${filename}.v${version}-${build}.min.css`,
    outputStyle: 'compressed',
    sourceMap: true,
  }, async (err, result) => {
    if (err) {
      reject(new Error(`Error building bundleSass: ${err}`));
    }
    fs.writeFileSync(`${dest}/${filename}.v${version}-${build}.min.css`, await postcss([autoprefixer]).process(result.css.toString(), { from: source }));
    fs.writeFileSync(`${dest}/${filename}.v${version}-${build}.min.css.map`, result.map.toString());
    resolve(result);
  });
});

const getDirectoryContentsRecursively = (src) => {
  const dirContents = fs.readdirSync(path.join(__dirname, src), 'utf8');

  return dirContents.map((file) => {
    if (fs.statSync(path.join(__dirname, `${src}/${file}`)).isDirectory()) {
      return {
        type: 'directory',
        name: file,
        items: getDirectoryContentsRecursively(`${src}/${file}`),
      };
    }
    return {
      type: 'file',
      name: file,
      contents: fs.readFileSync(path.join(__dirname, `${src}/${file}`), 'utf8'),
    };
  });
};

const buildTemplates = (src, templates, dest) => new Promise(async (resolve, reject) => {
  try {
    const loader = new nunjucks.FileSystemLoader([path.join(__dirname, src), path.join(__dirname, templates)]);
    const env = new nunjucks.Environment([loader]);

    const contents = {
      type: 'directory',
      name: dest,
      items: getDirectoryContentsRecursively(src),
    };

    contents.items.map((item) => {
      if (item.type === 'directory') {
        try {
          fs.statSync(path.join(__dirname, `${contents.name}/${item.name}`));
        } catch (err) {
          fs.mkdirSync(path.join(__dirname, `${contents.name}/${item.name}`));
        }
        item.items.map((item2) => {
          fs.writeFileSync(`${path.join(__dirname, `${contents.name}/${item.name}`)}/${item2.name.split('.')[0]}.html`, env.renderString(item2.contents), 'utf8');
          return false;
        });
      } else {
        fs.writeFileSync(`${path.join(__dirname, contents.name)}/${item.name.split('.')[0]}.html`, env.renderString(item.contents), 'utf8');
        return false;
      }
      return false;
    });

    resolve(contents);
  } catch (reason) {
    reject(new Error(reason));
  }
});

module.exports = {
  buildJs,
  lintJs,
  testJs,
  buildSass,
  buildTemplates,
};
