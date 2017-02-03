/* eslint-env node */
/* eslint-disable one-var, no-var */
var i = require('icepick'),
  path = require('path'),
  webpack = require('webpack'),
  webpackConfigBase = require('./webpack.config.base');

var DIST_PATH = 'dist';

/* eslint-enable one-var */

webpackConfigBase = i.freeze(webpackConfigBase);

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
