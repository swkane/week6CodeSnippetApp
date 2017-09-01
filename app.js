const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const Snippet = require('./models/snippet');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const addSnippetController = require('./controllers/add-snippet');
const session = require('express-session');
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      flash = require('express-flash-messages');

const app = express();


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

// session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

//passport

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.authenticate(username, password, function(err, user) {
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                })
            }
        })
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// Controller Routes
app.use('/add', addSnippetController);
// app.use('/edit', editSnippetController);



// app.get('/', function(req, res) {
//   res.render('login');
// });

// Passport Route

app.get('/', function(req, res) {
    res.render("login", {
        messages: res.locals.getMessages()
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))



// Login Route

app.post('/login', (req, res) => {
  MongoClient.connect(url, (err, db) => {

  })
})

// register route

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register/complete', function(req, res) {
  let username = req.body.username;
  let passHash = bcrypt.hashSync(req.body.password, 8);
  MongoClient.connect(url, function(err, db) {
    var user = new User({username: username, password: passHash, snippets: []});
    user.save()
    .then(function() {
      // actions to take on success
      console.log("User Added Success");
      console.log(user);
      db.users.insertOne(user);
    })
    .catch(function() {
      console.log("User Add Error");
      // action to take on error
    });
    res.redirect('/');
  });
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

app.get('/add', function(req, res) {
  res.render('add-snippet');
});

// !!Only run this code once to set up the db
// var snippet = new Snippet({title: "Test Snippet", body:"<tag>this is a test</tag>", notes:"These are notes", language:"Samscript", tags:"sam"});
// snippet.save()
//   .then(function () {
//     console.log("You added the test snippet!");
//     db.snippets.insertOne(snippet);
//   })
//   .catch(function () {
//     console.log("You failed to add test snippet");
//   });

app.listen(3000, function() {
  console.log("CodeSnippet Saver running on port: 3000");
  console.log(User);
});
