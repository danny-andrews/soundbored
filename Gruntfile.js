/* eslint-env node */
/* eslint-disable one-var, no-magic-numbers, prefer-const */
let url = require('url'),
  webpackConfigProd = require('./webpack.config.js'),
  webpackConfigDemo = require('./webpack.config.demo.js'),
  webpackConfigtest = require('./webpack.config.test.js');

const DEFAULT_PORT = 4387;
const DEFAULT_DEMO_PORT = 1234;

/* eslint-disable one-var */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // eslint-disable-line global-require

  grunt.initConfig({
    port: grunt.option('port') || DEFAULT_PORT,
    demo_port: grunt.option('port') || DEFAULT_DEMO_PORT,
    hostname: grunt.option('host-name') || 'localhost',
    url: url.format({
      protocol: 'http',
      hostname: '<%= hostname %>',
      port: '<%= port %>'
    }),
    demo_url: url.format({
      protocol: 'http',
      hostname: '<%= hostname %>',
      port: '<%= demo_port %>'
    }),

    open: {
      demo: {path: '<%= demo_url %>/index.html'},
      test: {path: '<%= url %>/index.html'}
    },
    'webpack-dev-server': {
      options: {
        keepAlive: true,
        inline: true,
        host: '<%= hostname %>',
        port: '<%= port %>'
      },
      demo: {webpack: webpackConfigDemo, port: '<%= demo_port %>'},
      test: {webpack: webpackConfigtest, contentBase: 'test'},
      prod: {webpack: webpackConfigProd}
    },
    webpack: {
      dist: webpackConfigProd,
      demo: webpackConfigDemo,
      test: webpackConfigtest
    },
    mochaTest: {
      test: {
        options: {require: './test/setup'},
        src: 'test/dist/tests.js'
      }
    }
  });

  grunt.registerTask('test', 'Run tests.', ['compile:test', 'mochaTest']);
  grunt.registerTask('ci', 'Run lints and tests.', ['lint', 'test']);
  grunt.registerTask('serve', 'Serve code.', env => {
    grunt.task.run(`open:${env}`, `webpack-dev-server:${env}`);
  });
  grunt.registerTask(
    'demo',
    'Run the demo page in your browser.',
    ['open:demo', 'webpack-dev-server:demo']
  );
  grunt.registerTask('compile', 'Compile code.', env => {
    grunt.task.run(`webpack:${env}`);
  });

  grunt.registerTask('default', 'demo');
};
