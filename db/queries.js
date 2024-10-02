const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const queryAllPublishedPosts = async () => {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const queryAllPosts = async () => {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    throw error;
  }
};

const queryPostsById = async (id) => {
  try {
    return await prisma.post.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const queryCreatePost = async (title, text, published = false, id) => {
  try {
    return await prisma.post.create({
      data: {
        title,
        text,
        published,
        User: {
          connect: { id },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

const queryUpdatePost = async (id, title, text, published) => {
  try {
    const updateData = { title, text };
    if (published !== undefined) {
      updateData.published = published;
    }

    return await prisma.post.update({
      where: {
        id,
      },
      data: updateData,
    });
  } catch (error) {
    throw error;
  }
};

const deletePostById = async (id) => {
  try {
    return await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  } catch (error) {
    throw error;
  }
};

const createUser = async (username, password) => {
  try {
    return await prisma.user.create({
      data: {
        username,
        password,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  queryAllPublishedPosts,
  queryAllPosts,
  queryPostsById,
  queryUpdatePost,
  queryCreatePost,
  deletePostById,
  getUserById,
  getUserByUsername,
  createUser,
};
