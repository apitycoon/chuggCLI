const fs = require('fs');
const path = require('path');

function readPackage() {
  var data = fs.readFile(path.join(__dirname, '../package.json'), (err, data) => {
    if (err) throw err;
    var packages = JSON.parse(data);
    packages.scripts['webpack-watch'] = 'webpack -w';
    var stringPackage = JSON.stringify(packages, null, 4);
    fs.writeFile(path.join(__dirname, '../package.json'), stringPackage, (err) => {
      if (err) throw err;
    })
  })
}

module.exports = readPackage;
