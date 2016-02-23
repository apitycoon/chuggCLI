const exec = require('child_process').exec;
const Promise = require('bluebird');


// run this executable to install packages

//takes arr of package names, installs them returns errors if any exists
function installPackages(arr) {
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
        resolve(obj);
      })
    }))
  })

  //check to see everything is installed and what failed
  Promise.all(packageResults).then(function(data) {
    data.forEach((result, index) => {
      if (result.err) {
        console.log('Error Installing: ', arr[index]);
        console.log('Error: ', result.stderr);
      } else {
        console.log('Installed: ', arr[index]);
      }
    })

  })

}


var test = ['sdfasdfsa', 'moment', 'jquery'];

installPackages(test);
