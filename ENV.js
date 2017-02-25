/* eslint-env node */
/* eslint-disable one-var, prefer-destructuring, no-var,
  prefer-arrow-callback, object-shorthand */
var path = require('path'),
  glob = require('glob'),
  last = require('lodash').last;

var SOUNDFILES = glob.sync('test/public/sounds/*.@(mp3|wav)').map(
  function(filepath) {
    return last(filepath.split(path.sep));
  }
);

module.exports = {
  ASSET_PATH: JSON.stringify(path.join('test', 'public')),
  SOUNDFILES: JSON.stringify(SOUNDFILES)
};
