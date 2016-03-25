'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
var pets;

app.disable('x-powered-by');


var morgan = require('morgan');
app.use(morgan('short'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 5000);

fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  pets = JSON.parse(data);

  app.listen(app.get('port'), function() {
    console.log('listening on', app.get('port'))
  })
});

app.get('/pets', function(req, res) {
  res.render('index', {
    pets: pets,
  });
});

app.get('/pets/:index', function(req, res) {
  var index = Number.parseInt(req.params.index);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(404);
  }

  res.render('index', {
    pets: JSON.stringify(pets[index]),
  });
});

app.get('/*', function(req, res) {
  res.set("Content-Type", "text/plain");
  res.status(404).send("Not found");
})

app.post('/pets', function(req, res) {
  var pet = req.body;

  if (Number.isNaN(pet.age) || pet.kind !== "" || pet.name !== "") {
    return res.sendStatus(400);
  }

  pets.push(pet);

  var petsJSON = JSON.stringify(pets);
  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      throw updateErr;
      res.statusCode(400).send('Bad Request')
    } else {
      res.render('index', {
        pets: pet,
      })
    }
  })
})

app.put('/pets/:index', function(req, res) {
  var index = Number.parseInt(req.params.index);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(404);
  }

  var pet = req.body;
  pets[index] = pet;

  if (Number.isNaN(pet.age) || pet.kind === "" || pet.name === "") {
    return res.sendStatus(400);
  }

  var petsJSON = JSON.stringify(pets);

  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      throw updateErr;
      res.statusCode(400).send('Bad Request')
    } else {
      res.render('index', {
        pets: pet,
      })
    }
  })
})

app.delete('/pets/:index', function(req, res) {
  var index = Number.parseInt(req.params.index);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(400);
  }

  var pet = pets.splice(index, 1) [0];

  res.render('index', {
    pets: pets
  })
});



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
