const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
// Follow/unfollow user


router.post('/:id/follow', authMiddleware, userController.followUser);
// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user profile
router.put('/:id', userController.updateUserProfile);

// Delete user
router.delete('/:id', userController.deleteUser);

router.get('/:id/followers', userController.getUserFollowers)

router.get('/:id/following', userController.getUserFollowing)
router.get('/:id/posts', userController.getUserPosts)
router.put('/:id/change-password', userController.changePassword)


module.exports = router;
