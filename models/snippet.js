const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: {type: String, require: true, unique: true},
  body: {type: String, require: true},
  notes: String,
  language: String,
  tags: String
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
