/* jshint varstmt: false */
var jsdom = require('jsdom').jsdom;
const MARKUP = `<!DOCTYPE html><html><head></head><body></body></html>`;

global.document = jsdom(MARKUP);
global.window = document.defaultView;
global.self = global.window;
global.navigator = global.window.navigator;

require('./dist/vendor');

function propagateToGlobal(window) {
  Object.keys(window)
    .filter(key => !(key in global))
    .forEach(key => global[key] = window[key]);
}

// Take all properties of the window object and also attach it to the mocha
//   global object
propagateToGlobal(global.window);
