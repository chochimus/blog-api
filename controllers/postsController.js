const { body, validationResult } = require("express-validator");
const prisma = require("../db/queries");

const getAllPosts = async (req, res) => {
  try {
    const user = req.user;
    let posts;
    if (user && user.role === "ADMIN") {
      posts = await prisma.queryAllPosts();
    } else {
      posts = await prisma.queryAllPublishedPosts();
    }
    res.json(posts);
  } catch (error) {
    console.error("Error fetching published posts: ", error);
    res
      .status(500)
      .json({ error: "An error occured while fetching published posts" });
  }
};

const postValidator = [
  body("postTitle").trim().notEmpty().withMessage("Title required").escape(),
  body("postText").trim().notEmpty().withMessage("No content given").escape(),
];

const createPost = [
  postValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { postTitle, postText, published } = req.body;
    const { id } = req.user;
    try {
      const post = await prisma.queryCreatePost(
        postTitle,
        postText,
        published,
        id
      );
      return res.status(200).json({ post });
    } catch (error) {
      console.error("Error creating post: ", error);
      return res
        .status(500)
        .json({ error: "An error occured while creating post." });
    }
  },
];

const getPostById = async (req, res) => {
  const { postid } = req.params;
  try {
    const user = req.user;
    const post = await prisma.queryPostsById(postid);

    if (!post.published) {
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied." });
      }
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post: ", error);
    res.status(500).json({ error: "An error occured while fetching post." });
  }
};

const updatePost = [
  postValidator,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { postid } = req.params;
    const { postTitle, postText, published } = req.body;
    try {
      const post = await prisma.queryUpdatePost(
        postid,
        postTitle,
        postText,
        published
      );
      return res.status(200).json({ post });
    } catch (error) {
      console.error("Error updating post: ", error);
      return res
        .status(500)
        .json({ error: "An error occured while updating post." });
    }
  },
];

const deletePost = async (req, res) => {
  const { postid } = req.params;
  try {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied." });
    } else {
      const post = await deletePostById(postid);
      return res.status(200).json({ message: "Post successfully deleted" });
    }
  } catch (error) {
    console.error("Error fetching post: ", error);
    res.status(500).json({ error: "An error occured while fetching post." });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
};
