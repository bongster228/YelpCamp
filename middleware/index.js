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
          res.redirect('back');
        }
      }
    });
  } else {
    // User is not authenticated
    res.redirect('back');
  }
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
};


module.exports = middlewareObject;
