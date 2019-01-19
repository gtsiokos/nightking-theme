var path = require('path');
var crypto = require('crypto');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

require('babel-polyfill');
var pkg = require('./package.json');
var static = require('./webpack.static.js');
var base64 = crypto.createHash('sha1').update(pkg.version).digest('hex').slice(0,7);

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'cheap-module-eval-source-map',
  node: {
    fs: 'empty'
  },
  entry: [
    // ES2015 polyfills
    'babel-polyfill',
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    // your code:
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: require('./webpack.rules.js')
  }
};
