var http = require('http');
var routes = require('./routes')

var handleRequest = function(req, res) {
  if (routes[req.url]) {
    routes[req.url](req, res);
  } else {
    res.end("no such route")
  }
}

var server = http.createServer(handleRequest);

server.listen(5000, 'localhost', function() {
console.log('listening');
})
