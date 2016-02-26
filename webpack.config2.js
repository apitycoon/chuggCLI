module.exports = {
 entry: 'index.js',
 output: 'bundle.js',
 module: {
  loaders: [
   {
    test: /${answers.test}/,
    loader: 'cowsay-loader'
   }
  ]
 }
}