const exec = require('child_process').exec;
const Promise = require('bluebird');


// run this executable to install packages

//takes arr of package names, installs them returns errors if any exists
function installPackages(arr) {
  if (!arr) return new Promise(function(resolve, reject) {
    resolve();
  });
  
  var packageResults = [];

  const cmd = 'npm i --save ';
  exec('npm init -y');

  arr.forEach(package => {
    var instCmd = cmd + package

    //pushes promises to let each package install and return results

    packageResults.push(new Promise(function(resolve, reject) {
      exec(instCmd, (err, stdout, stderr) => {
        var obj = {
          'err': err,
          'stdout': stdout,
          'stderr': stderr
        }
        resolve([obj, arr]);
      })
    }))
  })

  //check to see everything is installed and what failed
  return Promise.all(packageResults);

}

module.exports = installPackages
