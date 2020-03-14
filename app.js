/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable comma-dangle */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
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
// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'COVID-19',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

// allows variables or objects to be available in
// the rendering engine (ejs)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

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

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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

app.post('/campgrounds/:id/comments', isLoggedIn, async (req, res) => {
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
// AUTH ROUTES

// show register form
app.get('/register', (req, res) => {
  res.render('register');
});

// handle register request
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Create a new user using username from the form
  const newUser = new User({ username });

  // Register new user using username and password sent from the form
  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('/register');
    }

    // After creating the user, authenticate using 'local' strategy
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// show login form
app.get('/login', (req, res) => {
  res.render('login');
});

// handle login request
app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {});

// add logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

//---------------------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('YelpCamp server has started');
});
