module.exports = {
  entry: './entry.js',
  output: {
    filename: './output.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        query: {
          presets: [
            'react',
            'es2015'
          ]
        },
        exclude: /node_modules|bower_components/
      },
      {
        loader: 'style-loader!css-loader',
        test: /\.css/
      },
      {
        loader: 'file',
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/
      },
      {
        loader: 'url?prefix=font/&limit=5000',
        test: /\.(woff|woff2)$/
      },
      {
        loader: 'url?limit=10000&mimetype=application/octet-stream',
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/
      },
      {
        loader: 'url?limit=10000&mimetype=image/svg+xml',
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/
      },
      {
        loader: 'css-loader',
        test: /\.css/
      }
    ]
  },
  plugins: [
  ]
}