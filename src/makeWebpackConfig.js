import { compose, either, identity, map, reduce, pick } from 'ramda';

// addEntry :: Object -> Object
// extends the input object with an entry property
export const addEntry = (x) => ({
  ...x,
  entry: x.entry
});

// addOutput :: Object -> Object
// adds the filename to the output object
// this is the minimum required field for output
export const addOutputFilename = (x) => ({
  ...x,
  output: {
    filename: x.output.filename
  }
});

// addOutputPath :: Object -> Boolean | Object
// if a path was supplied it will be added to the output object
export const addOutputPath = (x) => (!!x.output.path && {
  ...x,
  output: {
    ...x.output,
    path: x.path
  }
});

// addOutputPublicPath :: Object -> Boolean | Object
// if a public path was supplied, add to output Object
export const addOutputPublicPath = (x) => (!!x.output.publicpath && {
  ...x,
  output: {
    ...x.output,
    publicPath: x.publicpath
  }
});

// addPlugins :: Object -> Boolean | Object
// if there is a plugins array then include it
export const addPlugins = (x) => (!!x.plugins && {
  ...x,
  plugins: x.plugins
})

// addLoadersArr :: Object -> Object
// loaders are provided as an array of objects
export const addLoadersArr = (x) => ({
  ...x,
  module: {
    loaders: map(mapLoader, x.module.loaders)
  }
})

// addLoaderLoader :: Object -> Boolean | Object
// adds loader property to object (part of loaders array)
export const addLoaderLoader = (x) => (!!x.loader && {
  ...x,
  loader: x.loader
});

// addLoaderLoaders :: Object -> Boolean | Object
// adds loaders collapsed into the chained format
export const addLoaderLoaders = (x) => (!!x.loaders && {
  ...x,
  loader: reduce(collapseLoaders, x.loaders[0], x.loaders.slice(1))
});

// collapseLoaders :: (String, String) -> String
// function used in the reduce of addLoaderLoaders
export const collapseLoaders = (a, b) => `${a}!${b}`;

// addLoaderTest :: Object -> Object
// adds the test to the loader Object
export const addLoaderTest = (x) => ({
  ...x,
  test: x.test
});

// addLoaderQuery :: Object -> Boolena | Object
// if a query is provided it is added to loader object
export const addLoaderQuery = (x) => (!!x.query && {
  ...x,
  query: x.query
});

// addLoaderInclude :: Object -> Boolena | Object
// if a include is provided it is added to loader object
export const addLoaderInclude = (x) => (!!x.include && {
  ...x,
  include: x.include
});

// addLoaderExclude :: Object -> Boolena | Object
// if a exclude is provided it is added to loader object
export const addLoaderExclude = (x) => (!!x.query && {
  ...x,
  exclude: x.exclude
});

// with a loader grab only the needed properties
const finalLoader = pick(['loader', 'test', 'query', 'include', 'exclude']);

// only grab the specific props needed for the objects
const finalConfig = pick(['entry', 'output', 'module', 'plugins']);

// compose the loader array functions
export const mapLoader = compose(
  finalLoader,
  either(addLoaderExclude, identity),
  either(addLoaderInclude, identity),
  either(addLoaderQuery, identity),
  either(addLoaderLoaders, identity),
  either(addLoaderLoader, identity)
)

export const finalCompose = compose(
  finalConfig,
  either(addPlugins, identity),
  addLoadersArr,
  either(addOutputPublicPath, identity),
  either(addOutputPath, identity),
  addOutputFilename,
  addEntry
)
