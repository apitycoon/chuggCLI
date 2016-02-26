import test from 'tape';
import * as config from './makeWebpackConfig.js';

test('testing addEntry function', (t) => {
  const answers = {
    entry: './test/file.js',
    other: 'someother property'
  }

  t.deepEqual(
    config.addEntry(answers),
    { entry: './test/file.js',
      other: 'someother property'}
  );

  t.end();
})

test('testing addOutputFilename function', (t) => {
  const answers = {
    entry: './test/file.js',
    other: 'someother property',
    filename: 'somefilename'
  }

  t.equal(
    config.addOutputFilename(answers).output.filename,
    'somefilename'
  )

  t.end();
})

test('testing addOutputPath function', (t) => {
  t.equal(
    config.addOutputPath({path:'TEST'}).output.path,
    'TEST',
    'expect when path is supplied for it to be added'
  )

  t.equal(
    config.addOutputPath({path:''}).output,
    undefined,
    'expect when path is blank for it to be undefined'
  )

  t.equal(
    config.addOutputPath({}).output,
    undefined,
    'expect when path is not supplied for it to be undefined'
  )

  t.end();
})

test('testing addOutputPublicPath function', (t) => {
  t.equal(
    config.addOutputPublicPath({publicpath:'TEST'}).output.publicPath,
    'TEST',
    'expect when publicpath is supplied for it to be added'
  )

  t.equal(
    config.addOutputPublicPath({publicpath:''}).output,
    undefined,
    'expect when publicpath is blank for it to be undefined'
  )

  t.equal(
    config.addOutputPublicPath({}).output,
    undefined,
    'expect when publicpath is not supplied for it to be undefined'
  )

  t.end();
})

test('testing addLoaderLoaders function', (t) => {

  t.equal(
    config.addLoaderLoaders({loaders: ['test1', 'test2']}).loader,
    'test1!test2',
    'expect to convert an array of loaders into a string'
  )
  t.equal(
    config.addLoaderLoaders({loaders: ['test1']}).loader,
    'test1',
    'expect a single element array will not get a !'
  )

  t.end();
})

test('testing addLoaderTest function', (t) => {
  const regEx = new RegExp('\.jsx');

  t.deepEqual(
    config.addLoaderTest({test: regEx}).test,
    regEx,
    'expect regex object'
  )

  t.end();
});

test('testing addLoadersArr', (t) => {
  const regEx = new RegExp('\.jsx');
  let answers = {
    loaders: [
      {loader:'css', test:regEx, nothing:'nothing'}
    ]
  }
  t.deepEqual(
    config.addLoadersArr(answers).module.loaders,
    [{loader:'css', test:regEx}],
    'should output loader and test only'
  )

  answers = {
    loaders: [
      {loaders: ['css', 'babel'], test:regEx}
    ]
  }
  t.deepEqual(
    config.addLoadersArr(answers).module.loaders,
    [{loader:'css!babel', test:regEx}],
    'should convert array loaders to string loader'
  )

  t.end();
})
