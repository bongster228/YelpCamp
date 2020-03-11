const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Campground', campgroundSchema);
