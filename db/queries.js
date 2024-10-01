const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const queryAllPublishedPosts =  async () => {
  try{
    return await prisma.post.findMany({
      where: {
        published: true,
      },
    });
  } catch(error){
    throw error;
  }
}

const queryAllPosts =  async () => {
  try{
    return await prisma.post.findMany();
  } catch(error){
    throw error;
  }
}

const queryPostsById =  async (id) => {
  try{
    return await prisma.post.findUnique({
      where: {
        id,
      },
    });
  } catch(error){
    throw error;
  }
}

const queryUpdatePost = async(id) => {
  try {
    return await prisma.post.update({
      where:{
        id
      },
    });
  } catch(error){
    throw error;
  }
}

const deletePostById = async(id) => {
  try{
    return await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch(error) {
    throw error;
  }
}


module.exports = {
  queryAllPublishedPosts,
  queryAllPosts,
  queryPostsById,
  queryUpdatePost,
  deletePostById,
}