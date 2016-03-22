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
var port = process.env.PORT || 5000;
server.listen(port, function() {
console.log('listening');
})
