/* eslint-env node */
/* eslint-disable no-var */
var ExtractTextPlugin = require('extract-text-webpack-plugin'),
  glob = require('glob'),
  i = require('icepick'),
  path = require('path'),
  webpack = require('webpack'),
  webpackConfigBase = require('./webpack.config.base.js');

webpackConfigBase = i.freeze(webpackConfigBase);

module.exports = i.thaw(i.merge(webpackConfigBase, {
  entry: {
    tests: glob.sync('test/*/*spec.js'),
    vendor: ['mocha/mocha.js', 'mocha/mocha.css']
  },
  output: {path: path.resolve('test', 'dist')},
  module: {noParse: /mocha\.js/},
  plugins: webpackConfigBase.plugins.concat(
    new ExtractTextPlugin('vendor', 'vendor.css'),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(
        i.assign(webpackConfigBase.configVals, {
          NODE_ENV: 'test',
          ASSET_PATH: 'public',
          PROJECT_ROOT: path.resolve(),
          LOCAL_PATH_SEP: path.sep
        })
      )
    })
  ),
  devtool: 'source-map'
}));
