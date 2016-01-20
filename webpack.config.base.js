/* jshint varstmt: false */
var readJSONSync = require('jsonfile').readFileSync;
var path = require('path');
var pull = require('lodash').pull;
var webpack = require('webpack');

var pkg = readJSONSync('package.json');
var dependencies = Object.keys(pkg.dependencies);
pull(dependencies, 'core-js', 'lodash');

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
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
    new webpack.ProvidePlugin({
      Promise: 'core-js/library/es6/promise',
      'Object.assign': 'core-js/fn/object/assign',
      ReactRedux: 'react-redux',
      App: 'app/containers/root',
      DevTools: 'app/containers/dev-tools',
      Board: 'app/containers/board',
      LogMonitor: 'redux-devtools-log-monitor',
      DockMonitor: 'redux-devtools-dock-monitor',
      selector: 'app/containers/dev-tools/selector',
      SoundPlayer: 'app/components/sound-player'
    })
  ],
  resolve: {
    root: __dirname,
    alias: {
      app: path.resolve(),
      test: path.resolve('test')
    }
  }
};
