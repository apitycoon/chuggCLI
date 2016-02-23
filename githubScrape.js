var cheerio = require('cheerio');
var rp = require('request-promise');

function githubScrape(url) {
  
  rp(url)
    .then(function(html) {
      var githubObj = {};
      var $ = cheerio.load(html);
        if ($(".js-directory-link:contains('README.md')").attr('href')) {
          rp(`${url}/raw/master/README.md`).then(function(readmeText) {
            var npmInstallIndex = readmeText.search("npm install ");
            
            githubObj.npmInstall = null;
            
              if (npmInstallIndex > 0) {
                var npmInstallLastIndex = readmeText.indexOf("`", npmInstallIndex + 1);
                githubObj.npmInstall = readmeText.slice(npmInstallIndex + 1, npmInstallLastIndex).trim();
              }
            
            githubObj.readme = readmeText;
            
            console.log(githubObj);
          });  
        } else {
          githubObj.npmInstall = null;
          githubObj.readme = null;
        }
    });
}

// githubSearch('https://github.com/nelix/cowsay-loader')

module.exports = githubScrape;