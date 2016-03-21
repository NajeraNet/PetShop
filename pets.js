'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    var pets = JSON.parse(data);
    var petNum = process.argv[3];

    if (pets[petNum]) {
      console.log(pets[petNum]);
    }

    else if (petNum > pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`)
      process.exit(1);
    }

    else {
      console.log(pets);
    }
  })
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    var pets = JSON.parse(data);
    var petage = parseInt(process.argv[3]);
    var petkind = process.argv[4];
    var petname = process.argv[5];

    var petobj = {
      age: petage,
      kind: petkind,
      name: petname
    }

    if (!petage || !petkind || !petname) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    pets.push(petobj);
    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pets);
    });
  });
} else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(upErr, data) {
    if (upErr) {
      throw upErr;
    }
    var pets = JSON.parse(data);
    var petNum = process.argv[3];
    var pet = pets[petNum];
    var petage = parseInt(process.argv[4]);
    var petkind = process.argv[5];
    var petname = process.argv[6];
    if (!pet || !petage || !petkind || !petname) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pet.age = petage;
    pet.kind = petkind;
    pet.name = petname;
    console.log(pet);
    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(updateErr) {
      if (updateErr) {
        throw updateErr;
      }

    })
  })
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', function(destroyErr, data) {
    if (destroyErr) {
      throw destroyErr;
    }
    var pets = JSON.parse(data);
    var petNum = process.argv[3];
    var pet = pets[petNum];

    if (!pet) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
    console.log(pets.splice(pet, 1))
    var petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, function(destErr) {
      if (destErr) {
        throw destErr;
      }
    })
  })

}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
