const Blog = require('../models/Blog');

// @desc    Get all blog posts
// @route   GET /api/posts
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username').populate('media'); // Populate media references
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
exports.createBlog = async (req, res) => {
  const { title, content, media } = req.body; // Include media in the request body

  try {
    const newBlog = new Blog({
      title,
      content,
      media // Include media references in the new blog post
    });

    await newBlog.save();
    res.json(newBlog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get details of a specific blog post
// @route   GET /api/posts/:id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username', // Select the 'username' field from the User model
      })
      .populate('comments') // Populate comments array
      .populate('media'); // Populate media array

    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getBlogByAuthorId = async (req, res) => {
  try {
    const { author } = req.query; // Extract author ID from query parameters

    // Query blogs with author ID filter and populate author's username
    const blogs = await Blog.find({ author })
      .populate('author', 'username')
      .sort({ createdAt: -1 }); // Sort by createdAt descending

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ msg: 'Blogs not found for this author' });
    }

    // Map blogs to include authorName derived from populated author object
    const blogsWithAuthorName = blogs.map(blog => ({
      ...blog.toJSON(),
      authorName: blog.author ? blog.author.username : 'Unknown',
    }));

    res.json(blogsWithAuthorName);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Update details of a specific blog post
// @route   PUT /api/posts/:id
exports.updateBlog = async (req, res) => {
  const { title, content, media } = req.body; // Include media in the request body
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    blog.title = title;
    blog.content = content;
    blog.media = media; // Update media references

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a specific blog post
// @route   DELETE /api/posts/:id
// @desc    Delete a specific blog post
// @route   DELETE /api/posts/:id
exports.deleteBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Blog removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addLike = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Blog.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes += 1
    await post.save()

    res.status(200).json({ message: "Liked Succesfully", post })
  }
  catch (error) {
    console.error("Error adding like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.addShare = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Blog.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.shared = true
    await post.save()

    res.status(200).json({ message: "Shared Succesfully", post })
  }
  catch (error) {
    console.error("Error adding share:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}