/* eslint-env node */
/* eslint-disable no-var */
var i = require('icepick'),
  path = require('path'),
  webpack = require('webpack'),
  webpackConfigBase = require('./webpack.config.base.js'),
  ENV = require('./ENV');

webpackConfigBase = i.freeze(webpackConfigBase);

module.exports = i.thaw(i.merge(webpackConfigBase, {
  entry: {
    app: [
      'index.js',
      'styles/app.scss'
    ],
    vendor: webpackConfigBase.entry.vendor.concat(
      'materialize-css/dist/css/materialize.css',
      'materialize-css/dist/js/materialize.js'
    )
  },
  output: {path: path.resolve('dist')},
  plugins: webpackConfigBase.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': i.assign(ENV, {NODE_ENV: '"development"'})
    })
  ),
  devtool: 'source-map'
}));
