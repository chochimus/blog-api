const { Router } = require("express");
const postsController = require("../controllers/postsController");
const postsRouter = Router();
const passport = require("passport");

const authenticateOptional = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user || null;
    next();
  })(req, res, next);
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    // Authenticate the user
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      // If the user is not authenticated, return 401 Unauthorized
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      req.user = user;

      // Check if the user's role is included in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    })(req, res, next);
  };
};

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

module.exports = postsRouter;
