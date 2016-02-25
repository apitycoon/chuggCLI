const test = require('tape');
const createWebpackConfig = require('../createWebpackConfig.js');


test('testing createWebpackConfig function', t => {

  // test return type of createWebpackConfig
  t.equal(typeof createWebpackConfig('.', false),
    'object',
    'expect return from createWebpackConfig to be an object');

  // check for methods on the primary config object
  t.equal(typeof createWebpackConfig('.', false).addEntry,
    'function',
    'main config should have a createLoader method');
  t.equal(typeof createWebpackConfig('.', false).createLoader,
    'function',
    'main config should have a createLoader method');
  t.equal(typeof createWebpackConfig('.', false).done,
    'function',
    'main config should have a done method');

  // check the output of the methods on the primary config object
  var testConfig = createWebpackConfig('.', false);
  testConfig.addEntry('TEST');
  t.equal(testConfig.entry,
    'TEST',
    'addEntry should write a string to the config object');
  t.equal(typeof testConfig.createLoader(),
    'object',
    'expect createLoader method to return an object');



  t.end();
})
