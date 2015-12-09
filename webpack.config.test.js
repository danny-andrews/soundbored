/* jshint varstmt: false */
var baseWebpack = require('./webpack.config.js');
var objectAssign = require('object-assign');
var glob = require('glob');

var testConfig = objectAssign(baseWebpack, {
  entry: glob.sync('test/*/*spec.js'),
  output: {filename: 'dist/tests.js'},
  plugins: []
});

module.exports = testConfig;
