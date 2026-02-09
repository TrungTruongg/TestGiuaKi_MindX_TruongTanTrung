import Post from "../model/Post.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        message: "userId and content are required",
      });
    }
    
    const post = new Post({
      userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: "Create post successful",
      data: {
        _id: post._id,
        userId: post.userId,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "content is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post found with this id",
      });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a post for this user",
      });
    }

    post.content = content;
    post.updatedAt = new Date();
    await post.save();

    res.status(200).json({
      success: true,
      message: "Update post successful",
      data: {
        _id: post._id,
        userId: post.userId,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
