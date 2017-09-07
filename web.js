const gzippo = require('gzippo')
const express = require('express');
const http = require('http')
const logger = require('morgan')
const csp = require('helmet-csp')

const app = express();

app.use(csp({
    directives: {
        defaultSrc: [`'self'`, 'https://schedule-builder-backend.herokuapp.com/api/'],
        imgSrc: ['imgur.com', 'https://thumb.ibb.co'],
        styleSrc: ['https://maxcdn.bootstrapcdn.com', 'https://cdnjs.cloudflare.com']
    }
}))

app.use(logger());
app.use(gzippo.staticGzip('' + __dirname + "/dist"));

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);