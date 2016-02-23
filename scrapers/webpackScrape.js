const cheerio = require('cheerio');
const rp = require('request-promise');
//rp is dependent on request and bluebird

// getData accepts a base url and an array of query objects
// the function returns a promise


function webpackScraper(url) {

  // test for bad url

  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const scrapedURLS = rp(options)
    .then($ => {
      const result = [];

      var elems = $('#wiki>ul li');
      // find the name, desc and URL for every
      elems.each((i, elem) => {
        var scrapedLoader = {};
        scrapedLoader.desc = $(elem).text();
        scrapedLoader.name = $(elem).children('a').text()
        scrapedLoader.url = $(elem).children('a').attr('href')
        result.push(scrapedLoader);
      })
      return result;
    })
    .catch(err => {
      // crawling failed or cheerio choked
      throw (err);
    })

  return scrapedURLS;

}


// webpackScraper('https://webpack.github.io/docs/list-of-loaders.html')
//   .then(data => console.log(data));

module.exports = webpackScraper;
