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

test('search webpack loader results', (t) => {
  t.plan(2);


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
    ]
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
    ]
  )

});
