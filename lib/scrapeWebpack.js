'use strict';

var cheerio = require('cheerio');
var rp = require('request-promise');
//rp is dependent on request and bluebird

// getData accepts a base url and an array of query objects
// the function returns a promise

function scrapeWebpack(url) {

  // test for bad url

  var options = {
    uri: url,
    transform: function transform(body) {
      return cheerio.load(body);
    }
  };

  var scrapedURLS = rp(options).then(function ($) {
    var result = [];

    var elems = $('#wiki>ul li');
    // find the name, desc and URL for every
    elems.each(function (i, elem) {
      var scrapedLoader = {};
      scrapedLoader.desc = $(elem).text();
      scrapedLoader.name = $(elem).children('a').text();
      scrapedLoader.url = $(elem).children('a').attr('href');
      result.push(scrapedLoader);
    });
    return result;
  }).catch(function (err) {
    // crawling failed or cheerio choked
    throw err;
  });

  return scrapedURLS;
}

// webpackScraper('https://webpack.github.io/docs/list-of-loaders.html')
//   .then(data => console.log(data));

module.exports = scrapeWebpack;