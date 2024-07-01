const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: {
    type: Number,
    default: 0,
  },
  shared: {
    type: Boolean,
    default: false
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }], // Reference to media files
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
