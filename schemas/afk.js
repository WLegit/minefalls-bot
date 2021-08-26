const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	id: String,
	s: Number,
  ms: Number,
  updated: Number
});

module.exports = mongoose.model('afk schema', Schema);