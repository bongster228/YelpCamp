const express = require('express');

const router = express.Router();
const Campground = require('../models/campground');

// Campground Index Route
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW Route
router.get('/:id', (req, res) => {
  // Find the campground with provided id from req
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});


module.exports = router;
