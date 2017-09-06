const gzippo = require('gzippo')
const express = require('express');
const http = require('http')
const app = express();

app.use(gzippo.staticGzip('' + __dirname));
app.use('/*', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);