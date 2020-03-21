/* eslint-disable no-lonely-if */

// All the middleware goes here

const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObject = {};

middlewareObject.checkCampgroundOwnership = (req, res, next) => {
  const { id } = req.params;

  if (req.isAuthenticated()) {
    Campground.findById(id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // Does user own campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Permission Denied');
          res.redirect('back');
        }
      }
    });
  } else {
    // Take the user back
    req.flash('error', 'You need to be logged in');
    res.redirect('back');
  }
};

middlewareObject.checkCommentOwnership = (req, res, next) => {
  const { comment_id } = req.params;

  // Make sure user is authenticated
  if (req.isAuthenticated()) {
    Comment.findById(comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // Does the found user match the authenticated user?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Permission Denied');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Login Required');
    // User is not authenticated
    res.redirect('back');
  }
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // key of 'error' will be used to display the message
  req.flash('error', 'Login Required');
  return res.redirect('/login');
};

module.exports = middlewareObject;
