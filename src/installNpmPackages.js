const spawn = require('child_process').spawnSync;

// run this executable to install packages

//takes arr of package names, installs them returns errors if any exists
function installPackages(arr) {

  spawn('npm', ['i', '--save', ...arr]);

  return arr

}

module.exports = installPackages;
