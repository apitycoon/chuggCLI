'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _makeWebpackConfig = require('./makeWebpackConfig.js');

var config = _interopRequireWildcard(_makeWebpackConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('testing addEntry function', function (t) {
  var answers = {
    entry: './test/file.js',
    other: 'someother property'
  };

  t.deepEqual(config.addEntry(answers), { entry: './test/file.js',
    other: 'someother property' });

  t.end();
});

(0, _tape2.default)('testing addOutputFilename function', function (t) {
  var answers = {
    entry: './test/file.js',
    other: 'someother property',
    filename: 'somefilename'
  };

  t.equal(config.addOutputFilename(answers).output.filename, 'somefilename');

  t.end();
});

(0, _tape2.default)('testing addOutputPath function', function (t) {
  t.equal(config.addOutputPath({ path: 'TEST' }).output.path, 'TEST', 'expect when path is supplied for it to be added');

  t.equal(config.addOutputPath({ path: '' }).output, undefined, 'expect when path is blank for it to be undefined');

  t.equal(config.addOutputPath({}).output, undefined, 'expect when path is not supplied for it to be undefined');

  t.end();
});

(0, _tape2.default)('testing addOutputPublicPath function', function (t) {
  t.equal(config.addOutputPublicPath({ publicpath: 'TEST' }).output.publicPath, 'TEST', 'expect when publicpath is supplied for it to be added');

  t.equal(config.addOutputPublicPath({ publicpath: '' }).output, undefined, 'expect when publicpath is blank for it to be undefined');

  t.equal(config.addOutputPublicPath({}).output, undefined, 'expect when publicpath is not supplied for it to be undefined');

  t.end();
});

(0, _tape2.default)('testing addLoaderLoaders function', function (t) {

  t.equal(config.addLoaderLoaders({ loaders: ['test1', 'test2'] }).loader, 'test1!test2', 'expect to convert an array of loaders into a string');
  t.equal(config.addLoaderLoaders({ loaders: ['test1'] }).loader, 'test1', 'expect a single element array will not get a !');

  t.end();
});

(0, _tape2.default)('testing addLoaderTest function', function (t) {
  var regEx = new RegExp('\.jsx');

  t.deepEqual(config.addLoaderTest({ test: regEx }).test, regEx, 'expect regex object');

  t.end();
});

(0, _tape2.default)('testing addLoadersArr', function (t) {
  var regEx = new RegExp('\.jsx');
  var answers = {
    loaders: [{ loader: 'css', test: regEx, nothing: 'nothing' }]
  };
  t.deepEqual(config.addLoadersArr(answers).module.loaders, [{ loader: 'css', test: regEx }], 'should output loader and test only');

  answers = {
    loaders: [{ loaders: ['css', 'babel'], test: regEx }]
  };
  t.deepEqual(config.addLoadersArr(answers).module.loaders, [{ loader: 'css!babel', test: regEx }], 'should convert array loaders to string loader');

  t.end();
});