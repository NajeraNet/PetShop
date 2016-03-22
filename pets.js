'use strict';

let fs = require('fs');
let path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    let pets = JSON.parse(data);
    

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
    let pets = JSON.parse(data);
    let petage = parseInt(process.argv[3]);
    let petkind = process.argv[4];
    let petname = process.argv[5];

    let petobj = {
      age: petage,
      kind: petkind,
      name: petname
    }

    if (!petage || !petkind || !petname) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    pets.push(petobj);
    let petsJSON = JSON.stringify(pets);

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
    let pets = JSON.parse(data);
    let petNum = process.argv[3];
    let pet = pets[petNum];
    let petage = parseInt(process.argv[4]);
    let petkind = process.argv[5];
    let petname = process.argv[6];
    if (!pet || !petage || !petkind || !petname) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pet.age = petage;
    pet.kind = petkind;
    pet.name = petname;
    console.log(pet);
    let petsJSON = JSON.stringify(pets);

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
    let pets = JSON.parse(data);
    let petNum = process.argv[3];
    let pet = pets[petNum];

    if (!pet) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
    console.log(pets.splice(pet, 1))
    let petsJSON = JSON.stringify(pets);
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
