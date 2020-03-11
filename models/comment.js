const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', { userNewUrlParser: true });

const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model('Comment', commentSchema);