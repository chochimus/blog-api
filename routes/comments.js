const { Router } = require("express");
const commentsController = require("../controllers/commentsController");
const {
  authenticateOptional,
  authorizeRole,
} = require("../middleware/authmiddleware");

const commentsRouter = Router({ mergeParams: true });

//get all comments
commentsRouter.get("/", authenticateOptional, commentsController.getComments);

//post comment
commentsRouter.post(
  "/",
  authorizeRole(["USER", "ADMIN"]),
  commentsController.createComment
);
//edit comment
commentsRouter.put(
  "/:commentid",
  authorizeRole(["USER", "ADMIN"]),
  commentsController.updateComment
);
//delete comment
commentsRouter.delete(
  "/:commentid",
  authorizeRole(["USER", "ADMIN"]),
  commentsController.deleteComment
);
module.exports = commentsRouter;
