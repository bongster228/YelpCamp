/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const seeds = [
  {
    name: "Cloud's Rest",
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    author: {
      id: '5e6c4cd2f3f0b4196978a800',
    },
    username: 'Mango',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    author: {
      id: '588c2e092403d111454fff76',
    },
    username: 'Jack',
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    author: {
      id: '588c2e092403d111454fff76',
    },
    username: 'Jack',
  },
];

const seedDB = async () => {
  // Remove all campgrounds
  await Campground.deleteMany({});
  console.log('Campgrounds removed');

  await Comment.deleteMany({});
  console.log('Comments removed');

  // eslint-disable-next-line no-restricted-syntax
  for (const seed of seeds) {
    const campground = await Campground.create(seed);

    console.log('Campground created');
    const comment = await Comment.create(
      {
        text: 'This place is great, but I wish there was internet',
        author: {
          id: '5e6c4cd2f3f0b4196978a800',
          username: 'Mango',
        },
      },
    );

    console.log('Comment created');
    campground.comments.push(comment);
    campground.save();

    console.log('Comment added to campground');
  }
};

module.exports = seedDB;
