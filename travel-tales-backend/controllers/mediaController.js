const Media = require('../models/Media');
const fs = require('fs');
const path = require('path');

// Define the absolute path for the uploads directory
const uploadDir = path.resolve(__dirname, '..', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload a new media file
// @route   POST /api/media
exports.uploadMedia = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Extract necessary information from the uploaded file
    const { filename, path: filePath, mimetype } = req.file;

    // Validate the file type, size, and other attributes if needed

    // Create a new Media object to save to the database
    const media = new Media({
      url: filePath,
      uploader: req.user ? req.user.id : null // Check if user authentication middleware is implemented
    });

    // Save the media object to the database
    await media.save();

    // Respond with the saved media object
    res.json(media);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Get all media files
// @route   GET /api/media
exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get media by ID
// @route   GET /api/media/:id
exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ msg: 'Media not found' });
    }
    res.json(media);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a media file
// @route   DELETE /api/media/:id
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ msg: 'Media not found' });
    }

    // Delete the media file from the server
    fs.unlinkSync(media.url);

    res.json({ msg: 'Media removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
