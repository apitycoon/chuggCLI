{
  entry: './client/main.js',
  output: {
    filename: 'bundle.js',
    path: '/Users/samhagan/dev/Codesmith/chuggCLI/build',
    publicPath: undefined
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /.jsx?$/,
        query: {
          presets: [
            'es2015',
            'react'
          ]
        },
        include: /node_modules/
      }
    ]
  },
  plugins: [
  ],
  devtool: 'source-map'
}