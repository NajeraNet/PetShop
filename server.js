var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
var pets;

app.set('view engine', 'ejs');
fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
    res.status(200);
  }
  pets = JSON.parse(data);
  app.listen(3000, function() {
    console.log('listening');
  })
});


app.get('/pets', function(req, res) {
    res.render('index', {
      pets: JSON.stringify(pets),
  });
});

app.get('/pets/0', function(req, res) {
  res.render('index', {
    pets: JSON.stringify(pets[0]),
  });
});

app.get('/pets/1', function(req, res) {
  res.render('index', {
    pets: JSON.stringify(pets[1])
  })
})

app.get('/*', function(req, res) {
  res.set("Content-Type", "text/plain");
  res.status(404).send("Not found");
})


// set.header('Content-Type', "text/")
// var handleRequest = function(req, res) {
//   var petRegExp = /^\/pets\/(.*)$/;
//   var matchy = req.url.match(petRegExp);
//
//   if (req.method === 'GET') {
//     if (routes[req.url]) {
//       routes[req.url](req, res);
//     } else if (matchy) {
//       routes.pethandler(req, res, matchy[1]);
//     }
//   }
//   if (req.method === 'POST') {
//     var body = [];
//     if (req.url === "/pets") {
//       req.on('data', function(chunk) {
//         body.push(chunk);
//       }).on('end', function() {
//         body = Buffer.concat(body).toString();
//         body = JSON.parse(body);
//         routes.petPostHandler(req, res, body);
//       });
//     }
//   } else {
//     res.statusCode = 404;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Not Found")
//   }
// }
