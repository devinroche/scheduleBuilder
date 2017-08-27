const gzippo = require('gzippo')
const express = require('express');
const http = require('http')
const app = express();

var app = express()
app.use(gzippo.staticGzip(''+__dirname))
app.use('/*', function(req, res){
    res.sendfile(__dirname+'/index.html')
})

var server = http.createServer(app)
server.listenerCount(process.env.PORT || 5000)