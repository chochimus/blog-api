const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const prisma = require("../db/queries");

const signupValidate = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Username must be no more than 20 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must only contain letters, numbers, or underscores")
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 32 })
    .withMessage("Password must be less than 32 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/) // This regex checks for any special character
    .withMessage("Password must contain at least one special character"),
  body("confirm-password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

const signup = [
  signupValidate,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.createUser(username, hashedPassword);
      res.status(201).json({ message: "User successfully created" });
    } catch (error) {
      console.error("Error creating user: ", error);
      if (
        error.code === "P2002" &&
        error.meta &&
        error.meta.target.includes("username")
      ) {
        return res.status(409).json({ error: "Username already exists." });
      }
      return res.status(500).json({ error: "An error occured during signup." });
    }
  },
];

const login = (req, res) => {
  const user = {
    id: req.user.id,
  };
  jwt.sign(
    { user },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1h" },
    (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Token generation failed" });
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
      res.json({ message: "Login successful" });
    }
  );
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  login,
  signup,
  logout,
};
