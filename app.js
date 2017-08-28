const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const Snippet = require('./models/snippet');
const addSnippetController = require('./controllers/add-snippet');
const editSnippetController = require('./controllers/edit-snippet');

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


app.get("/home", function(req ,res) {
  res.render("home");
});

app.listen(3000, function() {
  console.log("CodeSnippet Saver running on port: 3000");
});
