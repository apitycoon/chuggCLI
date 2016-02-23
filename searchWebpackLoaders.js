// searches the array of objects returned from scaping the
// webpack list of loaders for a keyword supplied by the user
function searchWebpackLoaders(keyword, scrapedList) {
  return scrapedList.filter(val => {
    return val.desc.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  });
}

module.exports = searchWebpackLoaders;
