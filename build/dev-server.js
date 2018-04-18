const express = require('express');
const morgan = require('morgan');
const webpack = require('webpack');
const serveStatic = require('serve-static');
const webpackConfig = require('./webpack.dev.conf');

const app = express();

const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb()
  })
});

app.use(morgan('dev'));

app.use(serveStatic('static'));
app.use(serveStatic('elements'));
app.use(serveStatic('demo'));

app.use(devMiddleware);

app.use(hotMiddleware);

app.listen(process.env.PORT || 8080);
