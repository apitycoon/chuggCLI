'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finalCompose = exports.mapLoader = exports.addLoaderExclude = exports.addLoaderInclude = exports.addLoaderQuery = exports.addLoaderTest = exports.collapseLoaders = exports.addLoaderLoaders = exports.addLoaderLoader = exports.addLoadersArr = exports.addPlugins = exports.addOutputPublicPath = exports.addOutputPath = exports.addOutputFilename = exports.addEntry = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

// addEntry :: Object -> Object
// extends the input object with an entry property
var addEntry = exports.addEntry = function addEntry(x) {
  return _extends({}, x, {
    entry: x.entry
  });
};

// addOutput :: Object -> Object
// adds the filename to the output object
// this is the minimum required field for output
var addOutputFilename = exports.addOutputFilename = function addOutputFilename(x) {
  return _extends({}, x, {
    output: {
      filename: x.output.filename
    }
  });
};

// addOutputPath :: Object -> Boolean | Object
// if a path was supplied it will be added to the output object
var addOutputPath = exports.addOutputPath = function addOutputPath(x) {
  return !!x.output.path && _extends({}, x, {
    output: _extends({}, x.output, {
      path: x.path
    })
  });
};

// addOutputPublicPath :: Object -> Boolean | Object
// if a public path was supplied, add to output Object
var addOutputPublicPath = exports.addOutputPublicPath = function addOutputPublicPath(x) {
  return !!x.output.publicpath && _extends({}, x, {
    output: _extends({}, x.output, {
      publicPath: x.publicpath
    })
  });
};

// addPlugins :: Object -> Boolean | Object
// if there is a plugins array then include it
var addPlugins = exports.addPlugins = function addPlugins(x) {
  return !!x.plugins && _extends({}, x, {
    plugins: x.plugins
  });
};

// addLoadersArr :: Object -> Object
// loaders are provided as an array of objects
var addLoadersArr = exports.addLoadersArr = function addLoadersArr(x) {
  return _extends({}, x, {
    module: {
      loaders: (0, _ramda.map)(mapLoader, x.module.loaders)
    }
  });
};

// addLoaderLoader :: Object -> Boolean | Object
// adds loader property to object (part of loaders array)
var addLoaderLoader = exports.addLoaderLoader = function addLoaderLoader(x) {
  return !!x.loader && _extends({}, x, {
    loader: x.loader
  });
};

// addLoaderLoaders :: Object -> Boolean | Object
// adds loaders collapsed into the chained format
var addLoaderLoaders = exports.addLoaderLoaders = function addLoaderLoaders(x) {
  return !!x.loaders && _extends({}, x, {
    loader: (0, _ramda.reduce)(collapseLoaders, x.loaders[0], x.loaders.slice(1))
  });
};

// collapseLoaders :: (String, String) -> String
// function used in the reduce of addLoaderLoaders
var collapseLoaders = exports.collapseLoaders = function collapseLoaders(a, b) {
  return a + '!' + b;
};

// addLoaderTest :: Object -> Object
// adds the test to the loader Object
var addLoaderTest = exports.addLoaderTest = function addLoaderTest(x) {
  return _extends({}, x, {
    test: x.test
  });
};

// addLoaderQuery :: Object -> Boolena | Object
// if a query is provided it is added to loader object
var addLoaderQuery = exports.addLoaderQuery = function addLoaderQuery(x) {
  return !!x.query && _extends({}, x, {
    query: x.query
  });
};

// addLoaderInclude :: Object -> Boolena | Object
// if a include is provided it is added to loader object
var addLoaderInclude = exports.addLoaderInclude = function addLoaderInclude(x) {
  return !!x.include && _extends({}, x, {
    include: x.include
  });
};

// addLoaderExclude :: Object -> Boolena | Object
// if a exclude is provided it is added to loader object
var addLoaderExclude = exports.addLoaderExclude = function addLoaderExclude(x) {
  return !!x.query && _extends({}, x, {
    exclude: x.exclude
  });
};

// with a loader grab only the needed properties
var finalLoader = (0, _ramda.pick)(['loader', 'test', 'query', 'include', 'exclude']);

// only grab the specific props needed for the objects
var finalConfig = (0, _ramda.pick)(['entry', 'output', 'module', 'plugins']);

// compose the loader array functions
var mapLoader = exports.mapLoader = (0, _ramda.compose)(finalLoader, (0, _ramda.either)(addLoaderExclude, _ramda.identity), (0, _ramda.either)(addLoaderInclude, _ramda.identity), (0, _ramda.either)(addLoaderQuery, _ramda.identity), (0, _ramda.either)(addLoaderLoaders, _ramda.identity), (0, _ramda.either)(addLoaderLoader, _ramda.identity));

var finalCompose = exports.finalCompose = (0, _ramda.compose)(finalConfig, (0, _ramda.either)(addPlugins, _ramda.identity), addLoadersArr, (0, _ramda.either)(addOutputPublicPath, _ramda.identity), (0, _ramda.either)(addOutputPath, _ramda.identity), addOutputFilename, addEntry);