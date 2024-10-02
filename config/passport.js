const passport = require("passport");
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../db/queries");
const bcrypt = require("bcryptjs");

const cookieExtractor = (req) => {
  return req && req.cookies ? req.cookies["token"] : null;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ["HS256"],
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.getUserByUsername(username);
      if (!user) {
        return done(null, false, {
          message: "Incorrect username",
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
//TODO issuer/audience
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.getUserById(jwt_payload.user.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
