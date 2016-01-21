/* jshint varstmt: false */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var i = require('icepick');
var path = require('path');
var webpack = require('webpack');

var webpackConfigBase = i.freeze(require('./webpack.config.base.js'));

module.exports = i.merge(webpackConfigBase, {
  entry: {
    tests: glob.sync('test/*/*spec.js'),
    vendor: webpackConfigBase.entry
      .vendor
      .concat('mocha/mocha.js', 'mocha/mocha.css')
  },
  output: {path: path.resolve('test', 'dist')},
  module: {
    noParse: /mocha\.js/,
    loaders: webpackConfigBase.module.loaders.concat({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css')
    })
  },
  plugins: webpackConfigBase.plugins.concat(
    new ExtractTextPlugin('vendor', 'vendor.css'),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(
        i.assign(webpackConfigBase.configVals, {
          NODE_ENV: 'test',
          ASSET_PATH: 'public'
        })
      )
    }),
    // For phantomjs
    new webpack.ProvidePlugin({'Array.from': 'core-js/fn/array/from'})
  ),
  devtool: 'source-map'
});
