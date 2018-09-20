// Webpack Client Side Render Config
module.exports = {
  entry: {
    src: '',
  },
  output: {
    filename: '.bundle',
  },
  module: {
    rules: [
      {
        test: require.resolve('../assets/src/js/components/index.js'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
              sourceMap: true,
            },
          },
          {
            loader: 'expose-loader',
            query: 'Components',
          },
        ],
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'minify'],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: require.resolve('react'),
        use: {
          loader: 'expose-loader',
          query: 'React',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    react: 'React',
  },
  mode: 'production',
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
