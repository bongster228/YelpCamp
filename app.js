/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable comma-dangle */
const express = require('express');
const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });

const PORT = 3000;

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

//---------------------------------------------------------------------------------------------
// Routes
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX Route
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from the DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds: allCampgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// CREATE Route
app.post('/campgrounds', (req, res) => {
  // Get data from form and add to campgrounds array
  // Redirect back to campgrounds page
  const { name, image } = req.body;
  const newCampground = { name, image };
  // Insert new campgrounds to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// NEW Route
// Show the form that will send the data and make post request
app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});
//---------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('YelpCamp server has started');
});
