const prisma = require("../db/queries");

const getAllPosts = async(req, res) => {
  try{
    const user = req.user;

    let posts;
    if(user && user.role === "ADMIN") {
      posts = await prisma.queryAllPosts();
    } else{
      posts = await prisma.queryAllPublishedPosts();
    }
    res.json(posts);
  } catch(error) {
    console.error("Error fetching published posts: ", error);
    res.status(500).json({error: 'An error occured while fetching published posts'});
  }
}

const createPost = async(req, res) => {

}

const getPostById = async(req, res) => {
  const {postid} = req.params;
  try{
    const user = req.user;
    const post = await prisma.queryPostsById(postid);
    
    if(!post.published){
      if(!user || user.role !== "ADMIN"){
        return res.statis(403).json({error: 'Access denied.'});
      }
    }
    res.json(post);
  } catch(error) {
    console.error("Error fetching post: ", error);
    res.status(500).json({error: "An error occured while fetching post."});
  }
}

//TODO add validator & update the query
const updatePost = async(req, res) => {
  const {postid} = req.params;
  try {
    const user = req.user;
    const post = await prisma.queryUpdatePost(postid);
  } catch(error){
    console.error("Error updating post: ", error);
    res.status(500).json({error: "An error occured while updating post."});
  }
}

const deletePost = async(req, res) => {
  const {postid} = req.params;
  try{
    const user = req.user;
    if(!user || user.role !== "ADMIN"){
      return res.status(403).json({error: 'Access denied.'});
    } else {
      const post = await deletePostById(postid);
      return res.status(200).json({message: 'Post successfully deleted'});
    }
  } catch(error) {
    console.error("Error fetching post: ", error);
    res.status(500).json({error: "An error occured while fetching post."});
  }
}

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
}