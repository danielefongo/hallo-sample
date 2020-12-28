const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  context: __dirname,
  entry: {
    main: ['./public/js/client.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve( __dirname, 'dist' ),
  },
  resolve: {
    fallback: { "events": false }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
}