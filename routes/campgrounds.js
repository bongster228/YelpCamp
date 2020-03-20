/* eslint-disable no-lonely-if */
/* eslint-disable comma-dangle */
const express = require('express');

const router = express.Router();
const Campground = require('../models/campground');

//--------------------------------------------------------------------------------------
// Middleware

// Used to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

// Used to authenticate the users
const checkCampgroundOwnership = (req, res, next) => {
  const { id } = req.params;

  if (req.isAuthenticated()) {
    Campground.findById(id, (err, foundCampground) => {
      if (err) {
        res.redirect('/campgrounds');
      } else {
        // Does user own campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    // Take the user back
    res.redirect('back');
  }
};

//--------------------------------------------------------------------------------------

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
router.post('/', isLoggedIn, async (req, res) => {
  // Get data from form and add to campgrounds array
  const { name, image, description } = req.body;

  // Get information about the user that created the campground
  const { _id, username } = req.user;
  const author = { id: _id, username };

  // Includes all the info needed to create a new campground
  const newCampground = {
    name,
    image,
    description,
    author
  };

  // Insert new campgrounds to DB
  const campground = await Campground.create(
    newCampground,
    (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/campgrounds');
      }
    }
  );
});

// NEW Route
// Show the form that will send the data and make post request
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW Route
router.get('/:id', (req, res) => {
  // Find the campground with provided id from req
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT Route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  const { id } = req.params;
  Campground.findById(id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE Route
router.put('/:id', checkCampgroundOwnership, (req, res) => {
  // Find and update the correct campground
  const { id } = req.params;
  const { campground } = req.body;

  Campground.findByIdAndUpdate(id, campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // Redirect to updated page
      res.redirect(`/campgrounds/${id}`);
    }
  });
});

// DELETE Route
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  const { id } = req.params;

  Campground.findByIdAndRemove(id, err => {
    if (err) {
      res.redirect('/campground');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
