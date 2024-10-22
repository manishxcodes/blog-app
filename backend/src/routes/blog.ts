import { Hono } from "hono"
import { authMiddlware } from '../middlewares/authMiddleware'
import { PrismaClient } from "@prisma/client/edge"
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
router.post('/', authMiddlware, async (c) => {
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
  
router.put('/', (c) => {
    return c.text('post edit route')
  })
  
// router.get('/:id', (c) => {
//     return c.text('get post using id ')
//   })
  
router.get('/bulk', authMiddlware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany()
    
  return c.json({posts})
})

// upload test route 
router.get('/',authMiddlware, async (c) => {
  return c.json({msg: "hello"})
})

export default router