const passport = require("passport");

//If token is authenticated, user will be in req, otherwise null
const authenticateOptional = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user || null;
    next();
  })(req, res, next);
};

//authorizeRole(['ADMIN']) will ONLY allow listed roles on route, if
//user doesn't have token 401, or if they have a token
//but lack privilage they will get a 403
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

module.exports = { authorizeRole, authenticateOptional, authenticateLocal };
