import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from '../middlewares/authMiddleware'
import { createUser } from '../controllers/createUser'
import { userSigninController } from '../controllers/userSigninController'
import { addBookmark } from '../controllers/addBookmarkController'
import { auth } from 'hono/utils/basic-auth'
import { getBookmark } from '../controllers/getBookmarkController'
import { removeBookmark } from '../controllers/removeBookmarkController'

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }, 
  Variables: {
    userId: string,
  }
}>()

// signup route
router.post('/signup', createUser)

// signin route
router.post('/signin', userSigninController)

//add bookmark route
router.post('/bookmarks/:id', authMiddleware, addBookmark)

// get bookmark route
router.get('/bookmarks', authMiddleware, getBookmark)

// delete bookmark route
router.put('/bookmarks/:id', authMiddleware, removeBookmark)

// get user post
router.get('/myposts', authMiddleware, async (c) => {
  const userId = c.get('userId');

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      posts: true,
    }
  });

  if(!user || user.posts.length == 0) {
    return c.json({message: "No Posts"})
  }

  return c.json({Posts: user.posts})
})

router.get('/test', (c) => {
return c.text('test route')
})

export default router 