/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable comma-dangle */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const User = require('./models/user');
const SeedDB = require('./seeds');

// Route files
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');


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

// Middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Requring Routes
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);


//---------------------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('YelpCamp server has started');
});
