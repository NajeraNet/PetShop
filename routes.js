var fs = require('fs');
var path = require('path');
var pets;
var petNum = process.argv[3];
var petsPath = path.join(__dirname, 'pets.json');
fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  pets = JSON.parse(data);
});

var routes = {
  '/pets': function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(pets));
  },
  pethandler: function(req, res, index) {
      if (index <= JSON.stringify(pets).length - 1 && index >= 0) {
        res.setHeader("Content-Type", 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(pets[index]));
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not Found")
      }
      // createPost: function(req, res) {
      //
      //   fs.writeFile(petsPath, petsJSON, function(writeErr) {
      //     if (writeErr) {
      //       throw writeErr;
      //     }
      //     console.log(pets);
      //   });
    // }
    }
}

module.exports = routes;
