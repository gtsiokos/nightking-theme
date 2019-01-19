var path = require('path');
var crypto = require('crypto');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

require('babel-polyfill');
var pkg = require('./package.json');
var static = require('./webpack.static.js')
var base64 = crypto.createHash('sha1').update(pkg.version).digest('hex').slice(0,7);

module.exports = {
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  entry: [
    // ES2015 polyfills
    'babel-polyfill',
    // your code:
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('./webpack.env.js')
    }),
    new HtmlWebpackPlugin({
      inject: false,
      title: pkg.description,
      js: static.js.map(src => src+'?'+base64),
      css: static.css.map(src => src+'?'+base64),
      template: path.join(__dirname, 'index.tpl.ejs')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    rules: require('./webpack.rules.js')
  }
};
