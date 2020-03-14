/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable comma-dangle */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const SeedDB = require('./seeds');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });

const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

SeedDB();
//---------------------------------------------------------------------------------------------
// Campground Routes
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
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// CREATE Route
app.post('/campgrounds', (req, res) => {
  // Get data from form and add to campgrounds array
  // Redirect back to campgrounds page
  const { name, image, description } = req.body;
  const newCampground = { name, image, description };
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
  res.render('campgrounds/new');
});

// SHOW Route
app.get('/campgrounds/:id', (req, res) => {
  // Find the campground with provided id from req
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});
//---------------------------------------------------------------------------------------------
// Comments Routes

app.get('/campgrounds/:id/comments/new', (req, res) => {
  // Find campground by id
  const { id } = req.params;
  Campground.findById(id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

app.post('/campgrounds/:id/comments', async (req, res) => {
  // Look up campground using id
  const { id } = req.params;
  const campground = await Campground.findById(id);

  // Create new comment
  const { comment } = req.body;
  const newComment = await Comment.create(comment);

  // Connect new comment to campground
  campground.comments.push(newComment);
  campground.save();

  // Redirect to campground show page
  res.redirect(`/campgrounds/${id}`);
});

//---------------------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('YelpCamp server has started');
});
