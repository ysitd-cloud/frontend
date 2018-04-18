const path = require('path');
const { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const utils = require('./utils');

module.exports = merge.smart(base, {
  entry: {
    app: ['./build/dev-client.js'],
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: true }),
  },
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new AssetsWebpackPlugin({
      filename: 'assets.json',
      path: path.join(process.cwd(), 'dist'),
      prettyPrint: true,
    }),
  ],
});
