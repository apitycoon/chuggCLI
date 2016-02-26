module.exports = {
 entry: './index.js',
 output: {
  filename: './bundle.js'
 },
 module: {
  loaders: [
   {
    test: /.scss/,
    loader: 'sass-loader'
   }
  ]
 }
}