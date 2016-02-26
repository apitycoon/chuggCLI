const fs = require('fs');
const Promise = require('bluebird');


function findWPFile() {
  return new Promise(function(resolve, reject) {
    fs.readFile('webpack.config.js', 'utf8', (err, data) => {
      if (!err) {
        var matches = data.match(/=\s*require\(\'\w+\'\)/g);
        if (!matches) {
          return resolve();
        }
        var packages = matches.map(match => {
          return match.slice(match.indexOf('\'') + 1, match.lastIndexOf('\''));
        })
        packages.unshift('webpack');
        resolve(packages);
      } else {
        resolve([]);
      }
    })
  })
}

module.exports = findWPFile;
