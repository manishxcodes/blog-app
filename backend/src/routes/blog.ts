import { Hono } from "hono"
import { authMiddleware } from '../middlewares/authMiddleware'
import { Prisma, PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

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
router.post('/', authMiddleware, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const formData = await c.req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true' ? true : false;

    // Check if title or content are missing or invalid
    if (typeof title !== 'string' || typeof content !== 'string' || !title.trim() || !content.trim()) {
      return c.json({ error: 'Invalid or missing title/content' }, 400);
    }

    //create post 
    const blog = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published,
        authorId: c.get('userId'),
      }
    })

    if(!blog) {
      return c.json({ error: "Error while posting the blog"})
    }
    return c.json({blog: blog})

    } catch (error) {
    console.error('Error during posting:', error)
    return c.json({ error }, 500)
  } 
})
  
// update route
router.put('/', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  const formData = await c.req.formData();
  const title =  formData.get("title") as string;
  const content = formData.get("content") as string;
  const blogId = formData.get("blogId") as string;

  // Check if title or content are missing or invalid
  if (typeof title !== 'string' || typeof content !== 'string' || !title.trim() || !content.trim()) {
    return c.json({ error: 'Invalid or missing title/content' }, 400);
  }

  // check if the blogId is correct 
  const isExistingBlog = await prisma.post.findUnique({
    where: {
      id: blogId,
    }, 
    select: {
      id: true,   // will fetch id only to check if it exists
    }
  });

  if(isExistingBlog) {
    const updatedPost = await prisma.post.update({
      where: {
        id: blogId,
        authorId: c.get('userId')
      }, 
      data: {
        title: title,
        content: content,
        published: true
      }
    })

    return c.json({
      message: "Succesfully Updated",
      updatedPost: updatedPost
    }, 200)
  }

  return c.json({message: "blog not found"})  
})
  
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
  console.log(blogId)
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