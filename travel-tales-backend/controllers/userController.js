const User = require('../models/User');
const Blog = require('../models/Blog')
const bcrypt = require('bcryptjs')
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.updateFollow = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userToFollow = await User.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if already following
    if (userToFollow.followers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You are already following this user' });
    }

    // Update following and followers arrays
    await User.findByIdAndUpdate(req.user.id, { $push: { following: req.params.userId } });
    await User.findByIdAndUpdate(req.params.userId, { $push: { followers: req.user.id } });

    res.json({ msg: 'User followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUnFollow = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userToUnfollow = await User.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if not following
    if (!userToUnfollow.followers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You are not following this user' });
    }

    // Update following and followers arrays
    await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.userId } });
    await User.findByIdAndUpdate(req.params.userId, { $pull: { followers: req.user.id } });

    res.json({ msg: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid old password' });
    }

    // Encrypt new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).send('Server Error');
  }
}
// Follow/unfollow user
exports.followUser = async (req, res) => {
  try {
    const { id: userId } = req.params; // Extracting userId from URL path
    const currentUser = await User.findById(req.user.id);
    console.log(req.user.id)
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(userId);
      targetUser.followers.pull(req.user.id);
      await Promise.all([currentUser.save(), targetUser.save()]);
      res.json({ message: `You have unfollowed user with ID ${userId}` });
    } else {
      // Follow
      currentUser.following.push(userId);
      targetUser.followers.push(req.user.id);
      await Promise.all([currentUser.save(), targetUser.save()]);
      res.json({ message: `You are now following user with ID ${userId}` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// @desc    Get all users
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -socialProfiles');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
exports.updateUserProfile = async (req, res) => {
  const { username, email, location, bio, profilePic, socialProfiles } = req.body;

  // Build user object
  const userFields = {};
  if (username) userFields.username = username;
  if (email) userFields.email = email;
  if (location) userFields.location = location;
  if (bio) userFields.bio = bio;
  if (profilePic) userFields.profilePic = profilePic;
  if (socialProfiles) userFields.socialProfiles = socialProfiles;

  try {
    // Check if user is authorized to update profile
    // (You might want to add authorization logic here)

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user document with the new userFields
    user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// @desc    Delete user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is authorized to delete account
    if (user.id !== req.params.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a list of followers for a specific user
// @route   GET /api/users/:id/followers
exports.getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.followers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a list of users a specific user is following
// @route   GET /api/users/:id/following
exports.getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
