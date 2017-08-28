const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const qs = require('qs');
const Snippet = require('../models/Snippet');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = 'mongodb://localhost:27017/snippetsdb';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


router.post("/" ,function(req, res) {
  console.log("You tried to add a snippet!");
  var snippet = new Snippet({title: req.body.title, body: req.body.body, notes: req.body.notes, language: req.body.language, tags: req.body.tags});
  snippet.save()
    .then(function() {
      // actions to take on success
      console.log("Add Snippt Success");
      db.snippets.insertOne(snippet);
    })
    .catch(function() {
      console.log("Snippet Add Error");
      // action to take on error
    });
  res.redirect('/home');
});


  module.exports = router;
