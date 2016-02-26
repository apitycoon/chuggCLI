import { map, flatten } from 'ramda';

// getExistingLoaders :: Object -> [String]
// takes a webpack.config object and returns only the used loaders
const getExistingLoaders = (x) => {
  if (!x.module) return [];
  return flatten(map(splitLoader, x.module.loaders));
};

// splitLoader :: String -> [String]
// takes each loader string and splits it by !
const splitLoader = (x) => map(cleanSplits, x.loader.split('!'));


//cleanSplits :: [String] -> [String]
// removes extra spaces on loaders once split by !
const cleanSplits = (x) => x.trim();

export default getExistingLoaders;
