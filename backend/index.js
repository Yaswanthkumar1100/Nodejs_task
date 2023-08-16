const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const ApiData = require('./models/apiData');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/joke_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function (callback) {
  console.log('Connected to MongoDB');
});

app.get('/fetch-data', async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    const fetchedData = response.data;

    const newData = new ApiData({ data: fetchedData });
    await newData.save();

    res.status(200).send('Joke fetched and saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching and saving joke' });
  }
});

app.get('/get-data', async (req, res) => {
  try {
    const dataFromMongo = await ApiData.find();
    res.status(200).json(dataFromMongo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data from MongoDB' });
  }
});

app.put('/update-joke/:id', async (req, res) => {
  try {
    const joke = await ApiData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }
    res.status(200).json(joke);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating joke in MongoDB' });
  }
});

app.delete('/delete-joke/:id', async (req, res) => {
  try {
    const joke = await ApiData.findByIdAndDelete(req.params.id);
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }
    res.status(200).json({ message: 'Joke deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting joke from MongoDB' });
  }
});

app.post('/add-joke', async (req, res) => {
  try {
    const newJoke = new ApiData({ data: req.body.data });
    await newJoke.save();
    res.status(201).json({ message: 'Joke added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding joke to MongoDB' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});