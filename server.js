var http = require('http');
var routes = require('./routes');
var url = require('url');
var handleRequest = function(req, res) {
  if (routes[req.url]) {
    routes[req.url](req, res);
  } else {
    res.end("no such route")
  }
}

var server = http.createServer(handleRequest);
var port = process.env.PORT || 5000;
server.listen(port, function() {
console.log(req.url);
console.log('listening');
})
