const fs = require('fs');
const path = require('path');

function readPackage() {
  var data = fs.readFile(path.join(__dirname, '../package.json'),(err, data) => {
    var package = JSON.parse(data)
    package.scripts['webpack-watch'] = 'webpack -w';
    var stringPackage = JSON.stringify(package, null, 4);
    fs.writeFile(path.join(__dirname, '../package.json'), stringPackage, (err) => {
      if(err) throw err;
    })

  })
}

module.exports = readPackage;
