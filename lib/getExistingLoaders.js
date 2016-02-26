'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

// getExistingLoaders :: Object -> [String]
// takes a webpack.config object and returns only the used loaders
var getExistingLoaders = function getExistingLoaders(x) {
  if (!x.module) return [];
  return (0, _ramda.flatten)((0, _ramda.map)(splitLoader, x.module.loaders));
};

// splitLoader :: String -> [String]
// takes each loader string and splits it by !
var splitLoader = function splitLoader(x) {
  return (0, _ramda.map)(cleanSplits, x.loader.split('!'));
};

//cleanSplits :: [String] -> [String]
// removes extra spaces on loaders once split by !
var cleanSplits = function cleanSplits(x) {
  return x.trim();
};

exports.default = getExistingLoaders;