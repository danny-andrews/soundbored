/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var url = require('url');
var config = require('./webpack.config.js');
var glob = require('glob');
const JS_GLOB = './{,!(node_modules|dist)/**/}*.js';
const JS_FILES = glob.sync(JS_GLOB);

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    port: grunt.option('port') || 4387,
    hostname: grunt.option('host-name') || 'localhost',
    url: url.format({
      protocol: 'http',
      hostname: '<%= hostname %>',
      port: '<%= port %>'
    }),

    open: {
      demo: {path: '<%= url %>/index.html'}
    },
    jscs: {src: JS_GLOB},
    'webpack-dev-server': {
      all: {
        webpack: config,
        keepAlive: true,
        inline: true,
        host: '<%= hostname %>',
        port: '<%= port %>'
      }
    },
    shell: {
      jshint: {command: 'node_modules/.bin/jshint ' + JS_FILES.join(' ')},
      mocha: {
        command: 'mocha --recursive --compilers js:babel-core/register' +
          ' --require ./test/setup.js'
      }
    }
  });

  grunt.registerTask('lint', 'Lint code.', ['shell:jshint', 'jscs']);
  grunt.registerTask('test', 'Run tests.', ['lint', 'shell:mocha']);
  grunt.registerTask('serve', 'Serve app.', ['open', 'webpack-dev-server']);

  grunt.registerTask('default', 'serve');
};
