var fs = require('fs');
var path = require('path');
var pets;
var petNum = process.argv[3];
var url = require('url');
var petsPath = path.join(__dirname, 'pets.json');
fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  pets = JSON.parse(data);
});
console.log(petNum);

var routes = {
  '/pets': function(req, res) {
   res.setHeader("Content-Type", "application/json");
   res.statusCode = 200;
   res.end(JSON.stringify(pets));
 },
 '/pets/0': function(req, res) {
   res.setHeader("Content-Type", "application/json");
   res.statusCode = 200;
   res.end(JSON.stringify(pets[0]));
 },
 '/pets/1': function(req, res) {
   res.setHeader("Content-Type", "application/json");
   res.statusCode = 200;
   res.end(JSON.stringify(pets[1]));
 }
}

module.exports = routes;
