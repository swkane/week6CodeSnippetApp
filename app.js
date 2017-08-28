const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const Snippet = require('./models/snippet');
// const addSnippetController = require('./controllers/add-snippet');
// const editSnippetController = require('./controllers/edit-snippet');


// Mongoose / Mongo Boiler Plate
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = 'mongodb://localhost:27017/snippetdb';
mongoose.connect(url);
const MongoClient = require('mongodb').MongoClient;

// Mustache Boiler Plate
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

// Link static sheets - css
app.use(express.static('public'));

// bodyParser Boiler
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Controller Routes
// app.use('/add', addSnippetController);
// app.use('/edit', editSnippetController);

// !!Only run this code once to set up the db
// var snippet = new Snippet({title: "Test Snippet", body:"<tag>this is a test</tag>", language:"Samscript", tags:"sam"});
// snippet.save()
//   .then(function () {
//     console.log("You added the test snippet!");
//     db.snippets.insertOne(snippet);
//   })
//   .catch(function () {
//     console.log("You failed to add test snippet");
//   });

app.get('/', function(req, res) {
  res.render('login');
});

app.get("/home", function(req ,res) {
  MongoClient.connect(url , function(err, db) {
    console.log("Connected to MongoDB");
    let snippets = db.collection('snippets');
    snippets.find().toArray()
      .then(function(docs) {
        res.render('home', {snippets: docs});
      });
      db.close();
  });
});

app.listen(3000, function() {
  console.log("CodeSnippet Saver running on port: 3000");
});
