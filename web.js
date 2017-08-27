const gzippo = require('gzippo')
const express = require('express');
const http = require('http')
const app = express();

var app = express()
app.use(express.static(__dirname + '/dist'))

// app.use(gzippo.staticGzip(''+__dirname))
// app.use('/*', function(req, res){
//     res.sendfile(__dirname+'/index.html')
// })

app.listen(process.env.PORT || 5000)