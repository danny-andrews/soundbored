/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var path = require('path');
var url = require('url');

var webpackConfig = require('./webpack.config.js');
var testWebpackConfig = require('./webpack.config.test.js');

const JS_GLOBS = [
  './*.js',
  './!(node_modules|dist)/!(dist){/**/,}*.js'
];

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
    webpackPath: path.join('webpack-dev-server', 'index.html'),

    open: {
      webpack: {path: '<%= url %>/<%= webpackPath %>'}
    },
    jscs: {all: JS_GLOBS},
    jshint: {
      options: {jshintrc: true},
      all: JS_GLOBS
    },
    'webpack-dev-server': {
      options: {
        keepAlive: true,
        inline: true,
        host: '<%= hostname %>',
        port: '<%= port %>'
      },
      demo: {webpack: webpackConfig},
      test: {webpack: testWebpackConfig, contentBase: 'test'}
    },
    webpack: {
      dist: webpackConfig,
      test: testWebpackConfig
    },
    shell: {
      mocha: {
        command: path.join(
          'node_modules/.bin/mocha-phantomjs <%= url %>',
          'index.html'
        )
      }
    }
  });

  grunt.registerTask('lint', 'Lint code.', ['jshint', 'jscs']);
  grunt.registerTask('test', 'Run tests.', [
    'lint',
    'shell:mocha'
  ]);
  grunt.registerTask('serve', 'Serve code.', function(env) {
    grunt.task.run('compile:' + env, 'webpack-dev-server:' + env);
  });
  grunt.registerTask(
    'demo',
    'Run the demo page in your browser.',
    ['open:webpack:demo', 'webpack-dev-server:demo']
  );
  grunt.registerTask('compile', 'Compile code.', function(env) {
    grunt.task.run('webpack:' + env);
  });

  grunt.registerTask('default', 'serve');
};
