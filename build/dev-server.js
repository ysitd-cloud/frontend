require('./check-versions')();

const serveStatic = require('serve-static');
const config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = config.dev.autoOpenBrowser;

const app = express();

app.use(serveStatic('static'));

const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000,
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb()
  })
});

app.get(/\/([\w\.]+)\/app.css/, (req, res) => {
  res.contentType('text/css');
  res.end();
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

const uri = 'http://localhost:' + port;

let _resolve;
const readyPromise = new Promise(resolve => {
  _resolve = resolve
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  _resolve()
});

const server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};
