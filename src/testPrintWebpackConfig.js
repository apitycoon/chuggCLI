import test from 'tape';

const testObj = {
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
    ]
  }
}
