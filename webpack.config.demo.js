/* jshint varstmt: false */
var i = require('icepick');
var path = require('path');
var webpack = require('webpack');

var webpackConfigBase = i.freeze(require('./webpack.config.base.js'));

module.exports = i.merge(webpackConfigBase, {
  entry: {app: 'index.js'},
  output: {path: path.resolve('dist')},
  plugins: webpackConfigBase.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(
        i.assign(webpackConfigBase.configVals, {NODE_ENV: 'development'})
      )
    })
  ),
  devtool: 'source-map'
});