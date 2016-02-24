const fs = require('fs');
const Promise = require('bluebird');


function findWPFile() {
  return new Promise(function(resolve, reject) {
    fs.readFile('webpack.config.js', 'utf8', (err, data) => {
      if (err) throw err;
      var matches = data.match(/=\s*require\(\'\w+\'\)/g);
      var packages = matches.map(match => {
        return match.slice(match.indexOf('\'') + 1, match.lastIndexOf('\''));
      })
      packages.unshift('webpack');
      resolve(packages);
    })
  })
}

modeule.exports = findWPFile;
