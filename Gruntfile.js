/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var url = require('url');
var config = require('./webpack.config.js');
const LINT_DIRS = ['components', 'containers', 'store', 'actions', 'reducers'];

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

    shell: {
      jshint: {command: 'node_modules/.bin/jshint *.js ' + LINT_DIRS.join(' ')}
    },
    jscs: {src: ['*.js'].concat(LINT_DIRS)},
    'webpack-dev-server': {
      all: {
        webpack: config,
        keepAlive: true,
        inline: true,
        host: '<%= hostname %>',
        port: '<%= port %>'
      }
    },
    open: {
      demo: {path: '<%= url %>/index.html'}
    }
  });

  grunt.registerTask('lint', 'Lint code.', ['shell:jshint', 'jscs']);
  grunt.registerTask('serve', 'Serve app.', ['open', 'webpack-dev-server']);

  grunt.registerTask('default', 'serve');
};
