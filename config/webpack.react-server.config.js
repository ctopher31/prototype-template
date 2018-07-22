// Webpack Server Side Render Config
import Webpack from 'webpack';
import MinifyPlugin from 'babel-minify-webpack-plugin';

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
              presets: ['env'],
              sourceMap: true,
            },
          },
        ],
      },
      // Uncomment this if you want to use your own version of React instead of the version
      // bundled with ReactJS.NET.
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
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new MinifyPlugin(),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
