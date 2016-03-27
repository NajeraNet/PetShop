'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
let pets;

app.disable('x-powered-by');


const morgan = require('morgan');
app.use(morgan('short'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 5000);

fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  pets = JSON.parse(data);

  app.listen(app.get('port'), function() {
    console.log('listening on', app.get('port'));
  });
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

app.get('/*', function(req, res, next) {
  res.set('Content-Type', 'text/plain');
  return next(errorAll)
})

app.post('/pets', function(req, res) {
  const pet = req.body;

  if (Number.isNaN(pet.age) || !pet.kind || !pet.name) {
    return res.sendStatus(400);
  }

  pets.push(pet);

  const petsJSON = JSON.stringify(pets);
  fs.writeFile(petsPath, petsJSON, function(updateErr) {
    if (updateErr) {
      throw updateErr;
      res.statusCode(400).send('Bad Request');
    } else {
      res.render('index', {
        pets: pet,
      });
    }
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
      throw updateErr;
      res.statusCode(400).send('Bad Request');
    } else {
      res.render('index', {
        pets: pet,
      });
    }
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
      throw updateErr;
      res.statusCode(400).send('Bad Request');
    } else {
      res.render('index', {
        pets: pet,
      });
    }
  });
});

app.delete('/pets/:index', function(req, res) {
  const index = Number.parseInt(req.params.index, 10);

  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(400);
  }

  const pet = pets.splice(index, 1)[0];

  res.render('index', {
    pets: pet,
  });
});

function notFounderr(err, req, res, next) {
  res.status(404).send("Not Found")
}

function errorAll(err, req, res, next) {
  console.log(err.stack);
  return res.send(500, { message: err.message });
}

app.use(notFounderr);
app.use(errorAll);
