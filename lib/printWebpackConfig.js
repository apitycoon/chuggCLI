'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _stringifyObject = require('stringify-object');

var _stringifyObject2 = _interopRequireDefault(_stringifyObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeConfigFile = function writeConfigFile(output, final) {
  final = (0, _stringifyObject2.default)(final, { indent: ' ' });
  final = 'module.exports = ' + final;
  (0, _fs.writeFileSync)(output, final);
};

exports.default = writeConfigFile;