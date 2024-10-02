const { Router } = require("express");
const authController = require("../controllers/authController");
const authRouter = Router();
const { authenticateLocal } = require("../middleware/authmiddleware");

authRouter.post("/login", authenticateLocal, authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/logout", authController.logout);

module.exports = authRouter;
