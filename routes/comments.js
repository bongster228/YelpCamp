const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const router = express.Router({ mergeParams: true });

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

// Commments New
router.get('/new', isLoggedIn, (req, res) => {
  // Find campground by id
  const { id } = req.params;
  console.log(id);
  Campground.findById(id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

// Comments Create
router.post('/', isLoggedIn, async (req, res) => {
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

module.exports = router;
