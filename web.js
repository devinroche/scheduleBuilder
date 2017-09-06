const gzippo = require('gzippo')
const express = require('express');
const http = require('http')
const logger = require('morgan')

const app = express();

app.use(logger());
app.use(gzippo.staticGzip('' + __dirname));

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);