const express = require('express');
const morgan = require('morgan');
const serveStatic = require('express-static-gzip');

const app = express();

app.use(morgan('common'));
app.use('/assets', serveStatic('/dist'));

app.listen(process.env.PORT);
