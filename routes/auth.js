const { Router } = require("express");
const authController = require("../controllers/authController");
const passport = require("passport");
const authRouter = Router();

const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info.message } || "Unauthorized");
    }
    req.logIn(user, { session: false }, (loginError) => {
      if (loginError) {
        res.status(500).json({ error: "Login error" });
      }
      next();
    });
  })(req, res, next);
};

authRouter.post("/login", authenticateLocal, authController.login);
authRouter.post("/signup", authController.signup);

module.exports = authRouter;
