const { Router } = require("express");
const postsController = require("../controllers/postsController");
const postsRouter = Router();
const commentsRouter = require("./comments");

const {
  authorizeRole,
  authenticateOptional,
} = require("../middleware/authmiddleware");

postsRouter.get("/", authenticateOptional, postsController.getAllPosts);
postsRouter.post("/", authorizeRole(["ADMIN"]), postsController.createPost);

postsRouter.get("/:postid", authenticateOptional, postsController.getPostById);
postsRouter.put(
  "/:postid",
  authorizeRole(["ADMIN"]),
  postsController.updatePost
);
postsRouter.delete(
  "/:postid",
  authorizeRole(["ADMIN"]),
  postsController.deletePost
);

postsRouter.use("/:postid/comments", commentsRouter);

module.exports = postsRouter;
