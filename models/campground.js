/* eslint-disable comma-dangle */
const mongoose = require('mongoose');
const Comment = require('./comment');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Add a pre hook to remove comments when campground is removed
campgroundSchema.pre('remove', async () => {
  await Comment.remove({
    _id: {
      $in: this.commments
    }
  });
});

module.exports = mongoose.model('Campground', campgroundSchema);
