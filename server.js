var http = require('http');
var routes = require('./routes');
var url = require('url')
var handleRequest = function(req, res) {
  var petRegExp = /^\/pets\/(.*)$/;
  var matchy = req.url.match(petRegExp);
  if (routes[req.url]) {
    routes[req.url](req, res);
  } else if (matchy) {
      routes.pethandler(req, res, matchy[1]);
  }
  else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found")
  }
}

var server = http.createServer(handleRequest);
var port = process.env.PORT || 5000;
server.listen(port, function() {
console.log('listening');
})
