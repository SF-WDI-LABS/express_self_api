// Requiring things
let express = require('express'),
  app = express();

let mongoose = require("mongoose");

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

let db = require('./models');

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//====================================
// ROUTES
let MushDB = db.Mushroom;

// Serve static files from the `/public` directory:
app.use(express.static('public'));

//====================================
//HTML Endpoints

// Homepage
app.get('/', function homepage(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// return all mushrooms
app.get('/api/mushrooms', function index(request, response) {
  MushDB.find({}, function(err, allMushrooms) {
    if (err) {
      response.status(500).json({ error: err.message });
    } else {
      response.json(allMushrooms);
    }
  });
});

// return a single mushroom
app.get('/api/mushrooms/:id', function show(request, response) {
  let id = request.params.id;
  MushDB.findOne({_id: id}, function(err, mushroom) {
    if (err) {
      if (err.name === "CastError") {
        response.status(404).json({ error: "Nothing found by this ID." });
      } else {
        response.status(500).json({ error: err.message });
      }
    } else {
      response.json(mushroom);
    }
  })
});

app.post("/api/mushrooms", function create(request, response) {
  let newShroom = new MushDB(request.body);
  newShroom.save(function(err, savedMushroom) {
      if (err) {
        response.status(500).json({ error: err.message });
      } else {
        response.json(savedMushroom);
      }
    });
});

app.delete('/api/mushrooms/:id', function destroy(request, response) {
  let mushId = request.params.id;
  // find mushroom\ by id and remove
  MushDB.findOneAndRemove({ _id: mushId }, function (err, deletedMushroom) {
    if (err) {
      response.status(500).json({ error: err.message });
    } else {
      response.json(deletedMushroom);
    }
  });
});

//====================================
// JSON API Endpoints

app.get('/api', function apiIndex(req, res) {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  // It would be seriously overkill to save any of this to your database.
  // But you should change almost every line of this response.
  res.json({
    woopsIForgotToDocumentAllMyEndpoints: true, // CHANGE ME ;)
    message: "Welcome to my personal api! Here's what you need to know!",
    documentationUrl: "https://github.com/example-username/express-personal-api/README.md", // CHANGE ME
    baseUrl: "http://YOUR-APP-NAME.herokuapp.com", // CHANGE ME
    endpoints: [{
        method: "GET",
        path: "/api",
        description: "Describes all available endpoints"
      },
      {
        method: "GET",
        path: "/api/profile",
        description: "Data about me"
      }, // CHANGE ME
      {
        method: "POST",
        path: "/api/campsites",
        description: "E.g. Create a new campsite"
      } // CHANGE ME
    ]
  })
});

// SERVER
// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('Express server is up and running on http://localhost:3000/');
});
