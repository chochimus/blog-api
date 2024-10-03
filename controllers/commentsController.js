const { body, validationResult } = require("express-validator");
const prisma = require("../db/queries");

const getComments = async (req, res) => {
  try {
    const { postid } = req.params;
    const post = await prisma.queryPostStatusById(postid);
    if (!post.published) {
      const user = req.user;
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied." });
      }
    }
    const comments = await prisma.queryAllComments(postid);
    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments: ", error);
    res
      .status(500)
      .json({ error: "An error occured while fetching comments." });
  }
};

const postValidator = [
  body("text").trim().notEmpty().withMessage("No content given").escape(),
];
const createComment = [
  postValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    const { postid } = req.params;
    const { id } = req.user;
    try {
      const comment = await prisma.queryCreateComment(text, id, postid);
      return res.status(200).json({ comment });
    } catch (error) {
      console.error("Error creating post: ", error);
      return res
        .status(500)
        .json({ error: "An error occured while creating comment." });
    }
  },
];

const updateComment = [
  postValidator,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { commentid } = req.params;
    const { text } = req.body;
    try {
      const user = req.user;
      const commentAuthor = await prisma.queryCommentAuthorId(commentid);
      if (!commentAuthor) {
        return res.status(404).json({ error: "comment not found" });
      }
      const commentAuthorId = commentAuthor.userId;

      if (!user || (user.id !== commentAuthorId && user.role !== "ADMIN")) {
        return res.status(403).json({ error: "Access denied" });
      } else {
        const comment = await prisma.queryUpdateComment(commentid, text);
        res
          .status(200)
          .json({ comment, message: "Comment successfuly edited." });
      }
    } catch (error) {
      console.error("Error creating post: ", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating comment." });
    }
  },
];

const deleteComment = async (req, res) => {
  const { commentid } = req.params;
  try {
    const user = req.user;

    const commentAuthor = await prisma.queryCommentAuthorId(commentid);
    if (!commentAuthor) {
      return res.status(404).json({ error: "comment not found" });
    }
    const commentAuthorId = commentAuthor.userId;

    if (!user || (user.id !== commentAuthorId && user.role !== "ADMIN")) {
      return res.status(403).json({ error: "Access denied" });
    } else {
      await prisma.deleteCommentById(commentid);
      return res.status(200).json({ message: "Comment successfully deleted." });
    }
  } catch (error) {
    console.error("Error deleting comment: ", error);
    res.status(500).json({ error: "An error occured deleting post." });
  }
};

module.exports = {
  getComments,
  deleteComment,
  createComment,
  updateComment,
};
