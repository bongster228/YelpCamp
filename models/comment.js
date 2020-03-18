const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });

const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    // Reference to a user model id
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
