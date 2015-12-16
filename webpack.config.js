/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var webpack = require('webpack');
var path = require('path');
var pull = require('lodash/pull');
var readJSONSync = require('jsonfile').readFileSync;

var DIST_PATH = 'dist';
var pkg = readJSONSync('package.json');
var dependencies = Object.keys(pkg.dependencies);
dependencies = pull(dependencies, 'core-js');

module.exports = {
  entry: {
    app: 'index.js',
    vendor: dependencies
  },
  output: {path: DIST_PATH, filename: '[name].js'},
  module: {
    loaders: [
      {
        test: /\.jsx/,
        loaders: ['babel-loader', 'jsx-template-loader'],
        exclude: /node_modules/
      },
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
    new webpack.ProvidePlugin({
      Promise: 'core-js/library/es6/promise',
      'Object.assign': 'core-js/fn/object/assign'
    })
  ],
  resolve: {
    root: __dirname,
    alias: {app: path.resolve(), test: path.resolve('test')}
  }
};
