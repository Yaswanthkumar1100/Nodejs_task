const mongoose = require('mongoose');

const apiDataSchema = new mongoose.Schema({
  data: Object,
});

const ApiData = mongoose.model('JokeFromApi', apiDataSchema, 'jokeFromAPI');

module.exports = ApiData;
