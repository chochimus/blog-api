const express = require("express");
const app = express();

const postsRouter = require("./routes/posts");

app.use(express.urlencoded({extended: true}));
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));