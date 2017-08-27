const gzippo = require('gzippo')
const express = require('express');
const http = require('http')
const app = express();

app.use(express.static(__dirname + '/dist'))

app.listen(process.env.PORT || 5000)