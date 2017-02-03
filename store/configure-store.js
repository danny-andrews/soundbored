/* global require, module */
/* eslint-disable global-require */
import config from 'app/util/config';

if(config.inProd()) {
  module.exports = require('./configure-store.prod');
}
else {
  module.exports = require('./configure-store.dev');
}
