/* eslint-env node */
/* eslint-disable one-var, prefer-destructuring, no-var,
  prefer-arrow-callback, object-shorthand */
var readJSONSync = require('jsonfile').readFileSync,
  path = require('path'),
  pull = require('lodash').pull,
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = readJSONSync('package.json');
var dependencies = Object.keys(pkg.dependencies);
pull(dependencies, 'core-js', 'lodash');

/* eslint-enable one-var */

module.exports = {
  entry: {vendor: dependencies},
  output: {filename: '[name].js'},
  module: {
    rules: [
      {
        test: /\.jsx/,
        use: ['babel-loader', 'jsx-template-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.woff(2)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.(ttf|eot|svg)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].js'
    }),
    new webpack.ProvidePlugin({
      Promise: 'core-js/library/es6/promise',
      'Object.assign': 'core-js/fn/object/assign',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
      ReactRedux: 'react-redux',
      App: 'app/containers/root',
      DevTools: 'app/containers/dev-tools',
      Board: 'app/containers/board',
      LogMonitor: 'redux-devtools-log-monitor',
      DockMonitor: 'redux-devtools-dock-monitor',
      selector: 'app/containers/dev-tools/selector',
      SoundPlayer: 'app/components/sound-player'
    }),
    new ExtractTextPlugin('[name].css')
  ],
  resolve: {
    alias: {
      app: path.resolve(),
      test: path.resolve('test'),
      fetch: 'whatwg-fetch'
    }
  }
};
