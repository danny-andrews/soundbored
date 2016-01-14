/* jshint varstmt: false */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var cloneDeep = require('lodash/clone');
var path = require('path');

var baseWebpack = require('./webpack.config.js');

var testConfig = cloneDeep(baseWebpack);
testConfig.entry = {
  tests: glob.sync('test/*/*spec.js'),
  vendor: testConfig.entry.vendor.concat('mocha/mocha.js', 'mocha/mocha.css')
};
testConfig.output = {
  filename: '[name].js',
  path: path.resolve('test', 'dist')
};
testConfig.module.noParse = /mocha\.js/;
testConfig.module.loaders.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style', 'css')
});
testConfig.plugins.push(new ExtractTextPlugin('vendor', 'vendor.css'));

module.exports = testConfig;
