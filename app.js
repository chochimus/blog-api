const express = require("express");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");
const passport = require("passport");
const app = express();

require("./config/passport");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/posts", postsRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
