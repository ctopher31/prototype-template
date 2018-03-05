// Webpack Options
import webpack from 'webpack';
import MinifyPlugin from 'babel-minify-webpack-plugin';

const webpackConfig = {
  entry: {
    src: '',
  },
  output: {
    filename: '',
  },
  module: {
    rules: [
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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
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

export default webpackConfig;
