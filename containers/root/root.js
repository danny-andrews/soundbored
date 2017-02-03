/* global require, module */
/* eslint-disable global-require */
import config from 'app/util/config';

if(config.inProd()) {
  module.exports = require('./root.prod.jsx');
}
else {
  module.exports = require('./root.dev.jsx');
}
