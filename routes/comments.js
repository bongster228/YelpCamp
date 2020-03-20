/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const { isLoggedIn, checkCommentOwnership } = require('../middleware');

const router = express.Router({ mergeParams: true });


//--------------------------------------------------------------------------------------

// Commments New Route
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

// Comments Create Route
router.post('/', isLoggedIn, async (req, res) => {
  // Look up campground using id
  const { id } = req.params;
  const campground = await Campground.findById(id);

  // Create new comment
  const { comment } = req.body;
  const newComment = await Comment.create(comment);

  // Add username and id to comment
  // isLoggedIn middleware ensuers that user is logged in
  const { _id, username } = req.user;
  newComment.author.id = _id;
  newComment.author.username = username;
  newComment.save();

  // Connect new comment to campground
  campground.comments.push(newComment);
  campground.save();

  // Redirect to campground show page
  res.redirect(`/campgrounds/${id}`);
});

// Edit Route
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  // Get the campground's id from request
  const { id: campground_id } = req.params;

  // Find the comment by id
  const { comment_id } = req.params;
  Comment.findById(comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { campground_id, comment: foundComment });
    }
  });
});

// Update Route
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  // Get the id and the updated contents of the comment
  const { comment_id, id: campground_id } = req.params;
  const { comment } = req.body;

  // Find the comment by id and update it with the new content
  Comment.findByIdAndUpdate(comment_id, comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${campground_id}`);
    }
  });
});

// Destroy Route
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  const { comment_id, id: campground_id } = req.params;

  Comment.findByIdAndRemove(comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${campground_id}`);
    }
  });
});

module.exports = router;
