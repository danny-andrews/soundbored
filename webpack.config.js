/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var i = require('icepick');
var path = require('path');
var webpack = require('webpack');
var webpackConfigBase = i.freeze(require('./webpack.config.base'));

var DIST_PATH = 'dist';

module.exports = i.merge(webpackConfigBase, {
  entry: {
    app: 'index.js',
    vendor: webpackConfigBase.entry.vendor.concat(
      'materialize-css/dist/css/materialize.css',
      'materialize-css/dist/js/materialize.js'
    )
  },
  output: {path: path.resolve(DIST_PATH)},
  plugins: webpackConfigBase.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(
        i.assign(webpackConfigBase.configVals, {
          NODE_ENV: 'production',
          ASSET_PATH: ''
        })
      )
    })
  ),
  devtool: 'none'
});
