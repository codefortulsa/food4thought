const express = require("express");
const path = require("path");
var http = require('http');
var enforce = require('express-sslify');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(express.static(path.join(__dirname, './dist')));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(PORT, ()=> {
  console.log(`Listening on port: ${PORT}`)
})
