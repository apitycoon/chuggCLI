'use strict';

var cheerio = require('cheerio');
var rp = require('request-promise');

function scrapeGithub(url) {
  url += '/raw/master/README.md';
  var results = rp(url).then(function (html) {
    var githubObj = {};
    var $ = cheerio.load(html);
    var npmInstallIndex = html.search("npm install ");

    githubObj.npmInstall = null;
    githubObj.readme = html;

    if (npmInstallIndex > 0) {
      var npmInstallLastIndex = html.indexOf("`", npmInstallIndex + 1);
      githubObj.npmInstall = html.slice(npmInstallIndex + 1, npmInstallLastIndex).trim();
    } else {
      githubObj.npmInstall = null;
    }

    return githubObj;
  });

  return results;
}

// scrapeGithub('https://github.com/nelix/cowsay-loader')

module.exports = scrapeGithub;