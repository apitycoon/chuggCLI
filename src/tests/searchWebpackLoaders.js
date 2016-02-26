const test = require('tape');
const searchWebpackLoaders = require('../searchWebpackLoaders.js');

const data = [
  {
    name: 'json',
    url: 'n/a',
    desc: 'loads file as JSON'
  },
  {
    name: 'json',
    url: 'n/a',
    desc: 'loads file as JSON'
  },
  {
    name: 'imports',
    url: 'n/a',
    desc: 'Imports stuff to the module'
  },
  {
    name: 'base64',
    url: 'n/a',
    desc: 'Loads file content as base64 string'
  },
  {
    name: 'babel',
    url: 'n/a',
    desc: 'Turn ES6 code into vanilla ES5 using Babel'
  },
  {
    name: 'typescript',
    url: 'n/a',
    desc: 'Loads TypeScript like JavaScript'
  },
  {
    name: 'css',
    url: 'n/a',
    desc: 'Loads css file with resolved imports and returns css code'
  }
];

test('testing searchWebpackloader function', (t) => {
  t.plan(3);


  // check multiple results
  t.deepEqual(
    searchWebpackLoaders('json', data),
    [
      {
        name: 'json',
        url: 'n/a',
        desc: 'loads file as JSON'
      },
      {
        name: 'json',
        url: 'n/a',
        desc: 'loads file as JSON'
      }
    ],
    'testing for when there are multiple search results that match the keyword'
  );

  // check single results
  t.deepEqual(
    searchWebpackLoaders('css', data),
    [
      {
        name: 'css',
        url: 'n/a',
        desc: 'Loads css file with resolved imports and returns css code'
      }
    ],
    `expects a single result from the search`
  );

  // check for empty results
  t.deepEqual(
    searchWebpackLoaders('akljads;fjasdkf', data),
    [],
    `testing for an empty result`
  );

});
