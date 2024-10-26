import { Hono } from "hono"
import { authMiddleware } from '../middlewares/authMiddleware'
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { createPost } from "../controllers/createPost"
import { updatePost } from "../controllers/updatePostController"

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }, 
  Variables: {
    userId: string, 
  }
}>()

// post routes
router.post('/', authMiddleware, createPost)
  
// update route
router.put('/', authMiddleware, updatePost)
  
// get all post route 
router.get('/bulk', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany()
    return c.json({posts})
  } catch(error) {
    return c.json({error})
  }

})

// get unique post route
router.get('/:id', async (c) => {
  const id = c.req.param('id')

  // check if id is provided 
  if(!id) {
    return c.json({ error: 'Blog ID is required'}, 400)
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id
    }
  })
  if(!post) {
    return c.json({error: "Something went wrong. Unable to get the post"}, 404)
  }

  return c.json(post)
})

// delete post route
router.delete('/:id', authMiddleware, async (c) => {
  const blogId = c.req.param('id');
  const userId = c.get('userId')

  // check if id is provided 
  if(!blogId) {
    return c.json({ error: 'Blog Id is required'}, 400)
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // check if the blog exists and belongs to the current user
  try {
    const isExistingBlog = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
      select: {
        authorId: true,
      }
    });
    
    if(!isExistingBlog) {
      return c.json({ error: "Blog not found"}, 404);
    }

    // check the blog belong to the authenticated user
    if( isExistingBlog.authorId !== userId) {
      return c.json({ error: "Unauthorised to delete this blog"}, 403)
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: blogId
      }
    });
    return c.json({ message: "Blog post deleted successfully", deletedPost}, 200)
  } catch(err) {
    return c.json({ error: 'An error occured while deleting the post', err}, 500)
  }
})

// test route 
router.get('/',authMiddleware, async (c) => {
  return c.json({msg: "hello"})
})

export default router