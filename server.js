'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
let pets;

app.disable('x-powered-by');

const emoji = require('node-emoji');

const morgan = require('morgan');
app.use(morgan('short'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const basicAuth = require('basic-auth');

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function() {
  console.log('listening on', app.get('port'));
});

app.use(express.static('public'));

app.use((req, res, next) => {
  const creds = basicAuth(req);

  if (creds && creds.name === 'admin' && creds.pass === 'meowmix') {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Required"');
  res.sendStatus(401);
})

fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  pets = JSON.parse(data);
});

app.use(function(req, res, next) {
  console.log('🙆');
  next();
});

app.get('/pets', function(req, res) {
  res.render('index', {
    pets: pets,
  });
});

app.get('/pets/:index', function(req, res, next) {
  const index = Number.parseInt(req.params.index, 10);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      return next(notFounderr);
    }

  res.render('index', {
    pets: pets[index],
  });
});

app.post('/pets', function(req, res) {
  const pet = req.body;

  if (Number.isNaN(pet.age) || !pet.kind || !pet.name) {
    return res.sendStatus(400);
  }

  pets.push(pet);

  const petsJSON = JSON.stringify(pets);
  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      return next(updateErr);
    }

    res.render('index', {
      pets: pet,
    });
  });
});

app.put('/pets/:index', function(req, res) {
  const index = Number.parseInt(req.params.index, 10);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(404);
  }

  const pet = req.body;
  pets[index] = pet;

  if (Number.isNaN(pet.age) || !pet.kind || !pet.name) {
    return res.sendStatus(400);
  }

  const petsJSON = JSON.stringify(pets);

  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      return next(updateErr);
    }

      res.render('index', {
        pets: pet,
    });
  });
});

app.patch('/pets/:index', function(req, res) {
  const index = Number.parseInt(req.params.index, 10);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(404);
  }

  const pet = pets[index];
  for (const prop in req.body) {
    pet[prop] = req.body[prop]
  }

  pets[index] = pet;

  if (Number.isNaN(pet.age) || pet.kind === '' || pet.name === '') {
    return res.sendStatus(400);
  }

  const petsJSON = JSON.stringify(pets);

  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      return next(updateErr);
    }

      res.render('index', {
        pets: pet,
    });
  });
});

app.delete('/pets/:index', function(req, res) {
  const index = Number.parseInt(req.params.index, 10);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(400);
  }

  const pet = pets.splice(index, 1)[0];

  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      return next(updateErr);
    }

      res.render('index', {
        pets: pet,
    });
  });
});

app.use(function(req, res) {
  res.status(404).send("Not Found")
});

app.use('*', function(err, req, res, next) {
  res.set('Content-Type', 'text/plain');
  console.log(err.stack);

  let message;

  if (app.get('env') === 'development') {
    message = err.message;
  }
    else {
      message = 'Internal Server Error'
    }
    res.status(500);
  return res.send(500, { message: err.message });
})
