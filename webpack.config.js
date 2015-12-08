/* jshint varstmt: false */
var webpack = require('webpack');

module.exports = {
  entry: {
    app: 'index.js',
    vendor: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk']
  },
  output: {filename: 'dist/app.js'},
  module: {
    loaders: [
      {
        test: /\.jsx/,
        loaders: [
          'babel-loader',
          'jsx-template-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'dist/vendor.js')
  ],
  resolve: {root: __dirname}
};
