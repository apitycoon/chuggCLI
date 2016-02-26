'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testObj = {
  entry: './entry.js',
  output: {
    filename: './output.js'
  },
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      query: {
        presets: ['react', 'es2015']
      },
      exclude: /node_modules|bower_components/
    }]
  }
};