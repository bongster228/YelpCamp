/* eslint-disable comma-dangle */
const express = require('express');

const PORT = 3000;

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const campgrounds = [
  {
    name: 'Salmon Creek',
    image:
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'
  },
  {
    name: 'Granite Hill',
    image:
      'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Mountain Goat Rest',
    image:
      'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Salmon Creek',
    image:
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'
  },
  {
    name: 'Granite Hill',
    image:
      'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Mountain Goat Rest',
    image:
      'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
  }
];

//---------------------------------------------------------------------------------------------
// Routes
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

app.post('/campgrounds', (req, res) => {
  // Get data from form and add to campgrounds array
  // Redirect back to campgrounds page
  const { name, image } = req.body;
  const newCampground = { name, image };
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

// Show the form that will send the data and make post request
app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});
//---------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('YelpCamp server has started');
});
