const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const base = require('./webpack.base.conf');

module.exports = merge.smart(base, {
  entry: {},
  target: 'node',
  // This tells the server bundle to use Node-style exports
  output: {
    libraryTarget: 'commonjs2'
  },
  // Externalize app dependencies. This makes the server build much faster
  // and generates a smaller bundle file.
  externals: [nodeExternals({
    whitelist: /\.css$/,
  })],
});
