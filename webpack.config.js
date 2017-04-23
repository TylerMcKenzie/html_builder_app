var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');


module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: [
      './js/app.js',
      './styles/manifest.css'
    ]
  },
  output: {
    filename: 'js/app.js',
    path: path.join(__dirname, 'public'),
    publicPath: "http://localhost:3000/"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader"})
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles/[name].css")
  ]
}
