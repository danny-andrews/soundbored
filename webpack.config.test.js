/* jshint varstmt: false */
var glob = require('glob');
var cloneDeep = require('lodash/clone');
var path = require('path');

var baseWebpack = require('./webpack.config.js');

var testConfig = cloneDeep(baseWebpack);
testConfig.entry = {
  tests: glob.sync('test/*/*spec.js'),
  vendor: testConfig.entry.vendor.concat('mocha/mocha.js')
};
testConfig.output = {
  filename: '[name].js',
  path: path.resolve('test', 'dist')
};
testConfig.module.noParse = /mocha\.js/;

module.exports = testConfig;
