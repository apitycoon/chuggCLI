'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var spawn = require('child_process').spawnSync;

// run this executable to install packages

//takes arr of package names, installs them returns errors if any exists
function installPackages(arr) {

  spawn('npm', ['i', '--save'].concat(_toConsumableArray(arr)));

  return arr;
}

module.exports = installPackages;