const express = require('express');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController')
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', blogController.getBlogs); // Get all blog posts
router.post('/', blogController.createBlog); // Create a new blog post
router.get('/:id', blogController.getBlogById);
router.put('/:id', authMiddleware, blogController.updateBlog); // Update details of a specific blog post
router.delete('/:id', authMiddleware, blogController.deleteBlog); // Delete a specific blog post

router.get('/:id/comments', commentController.getCommentsByPostId);
router.post('/:id/comments', authMiddleware, commentController.createComment);

router.post('/:id/like', blogController.addLike)
router.post('/:id/share', blogController.addShare)

module.exports = router;
