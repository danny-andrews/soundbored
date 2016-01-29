/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings, requireEnhancedObjectLiterals */
var glob = require('glob');
var readJSONSync = require('jsonfile').readFileSync;
var path = require('path');
var pull = require('lodash').pull;
var last = require('lodash').last;
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = readJSONSync('package.json');
var dependencies = Object.keys(pkg.dependencies);
pull(dependencies, 'core-js', 'lodash');
const SOUNDFILES = glob.sync('test/public/sounds/*.@(mp3|wav)')
  .map(function(filepath) {
    return last(filepath.split(path.sep));
  });

module.exports = {
  entry: {vendor: dependencies},
  output: {filename: '[name].js'},
  module: {
    loaders: [
      {
        test: /\.jsx/,
        loaders: ['babel-loader', 'jsx-template-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', ['css', 'sass'])
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.woff(2)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.(ttf|eot|svg)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
    new webpack.ProvidePlugin({
      Promise: 'core-js/library/es6/promise',
      'Object.assign': 'core-js/fn/object/assign',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      ReactRedux: 'react-redux',
      App: 'app/containers/root',
      DevTools: 'app/containers/dev-tools',
      Board: 'app/containers/board',
      LogMonitor: 'redux-devtools-log-monitor',
      DockMonitor: 'redux-devtools-dock-monitor',
      selector: 'app/containers/dev-tools/selector',
      SoundPlayer: 'app/components/sound-player'
    }),
    new ExtractTextPlugin('app.css')
  ],
  resolve: {
    root: __dirname,
    alias: {
      app: path.resolve(),
      test: path.resolve('test'),
      fetch: 'whatwg-fetch'
    }
  },
  configVals: {
    ASSET_PATH: path.join('test', 'public'),
    SOUNDFILES: SOUNDFILES
  }
};
