import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { userSignupSchema, userSigninSchema } from '../types'
import bcrypt, { hash } from 'bcryptjs'
import { sign } from 'hono/jwt'
import { authMiddleware } from '../middlewares/authMiddleware'
import { useId } from 'hono/jsx'

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
router.post('/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    

    // Zod validation
    const response = userSignupSchema.safeParse(body)
    if (!response.success) {
      return c.json({ message: 'Incorrect inputs' }, 400)
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })
    if (existingUser) {
      return c.json({ message: 'User already exists' }, 403)
    }

    // Hash password
    const saltRounds = 10
    const plainTextPassword = body.password
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt)

    // Create user
    await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        username: body.username,
        name: body.name,
      },
    })

    return c.json({ message: 'User Created Successfully' })

  } catch (error) {
    console.error('Error during signup:', error)
    return c.json({ message: 'An error occurred during signup' }, 500)
  } 
})

/** 
other method
router.post('/signup', async (c) => {
  let prisma: PrismaClient 

  try {
    const datasourceUrl = c.env.DATABASE_URL;
    if (!datasourceUrl) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: datasourceUrl,
        },
      },
    }).$extends(withAccelerate());

    const body = await c.req.json();

    // Zod validation
    const response = userSignupSchema.safeParse(body);
    if (!response.success) {
      return c.json({ message: 'Incorrect inputs' }, 400);
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      return c.json({ message: 'User already exists' }, 400);
    }

    // Hash passwordn
    const saltRounds = 10;
    const plainTextPassword = body.password;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    // Create user
    await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        username: body.username,
        name: body.name,
      },
    });

    return c.json({ message: 'User Created Successfully' });

  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ message: 'An error occurred during signup' }, 500);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});
**/

// signin route
router.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()

  // validation using zod 
  const response = userSigninSchema.safeParse(body)
  if(!response.success) {
    return c.json({message: "Invalid credentials"})
  }

  // verify user 
  const isExistingUser = await prisma.user.findFirst({
    where: {
      email: body.email
    }
  })
  if(!isExistingUser) {
    return c.json({message: 'Invalid credentials'})
  }

  //verify password
  const hashedPassword = isExistingUser.password
  const plainTextPassword = body.password

  const isPasswordCorrect = await bcrypt.compare(plainTextPassword, hashedPassword)
  if(isPasswordCorrect) {
    const token = await sign({id: isExistingUser.id}, c.env.JWT_SECRET)
    return c.json({token: token}, 200)
  } else {
    return c.json({message: "Invalid credentials"})
  }
})

//add bookmark route
router.post('/bookmarks/:id', authMiddleware, async (c) => {
  const blogId = c.req.param('id');
  const userId = c.get('userId')

  // check if id is provided 
  if(!blogId) {
    return c.json({ error: 'Blog Id is required'}, 400)
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  // check if the post exists
  const isExistingBlog = await prisma.post.findUnique({
    where: {
      id: blogId,
    },
  });
  if(!isExistingBlog) {
    return c.json({ error: 'Blog not found'}, 404)
  }

  // check if its already bookmark
  try {
    const alreadyBookmarked = await prisma.user.findFirst({
      where: {
        id: userId,
        bookmarks: {
          some: {
            id: blogId
          },
        }
      },
    });

    if(alreadyBookmarked) {
      return c.json({ message: "This blog is already bookmarked"}, 400);
    }

    // add the post to user bookmark
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      }, 
      data: {
        bookmarks: {
          connect: {    // connects the post to the user's bookmarks
            id: blogId, 
          }
        }
      },
      select: {
        id: true,
        bookmarks: true
      }
    });

    return c.json({
      message: "Blog bookmarked successfully",
      bookmarks: updateUser.bookmarks,
    }, 200)
  
  } catch (err) {
    return c.json({ error: 'Something went wrong', err}, 500)
  }
})

// get bookmark route
router.get('/bookmarks', authMiddleware, async (c) => {
  const userId = c.get('userId');

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      bookmarks: true,
    }
  });

  if(!user || user.bookmarks.length == 0) {
    return c.json({message: "No bookmarks"})
  }

  return c.json({bookmarks: user.bookmarks.map((bookmark) => bookmark.id)});  
})

// delete bookmark route
router.put('/bookmarks/:id', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const blogId = c.req.param('id')

  if(!blogId) {
    return c.json({message: 'Blog id required'}, 400);
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  // check if post exist 
  const isExistingBlog = await prisma.post.findUnique({
    where: {
      id: blogId
    }
  })
  if(!isExistingBlog) {
    return c.json({error: "Blog not found"}, 404)
  }

  // check if its bookmarked by the user
  const alreadyBookmarked = await prisma.user.findFirst({
    where: {
      id: userId,
      bookmarks: {
        some: {
          id: blogId
        }
      }
    }, 
    select: {
      id: true
    }
  });
  
  if(!alreadyBookmarked) {
    return c.json({message: "+Post is not bookmarked, cannot remove"}, 400);
  }

  // check if its authenticated user
  if(alreadyBookmarked.id !== userId) {
    return c.json({message: "Unauthorized to remove bookmarks"});
  }

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      }, 
      data: {
        bookmarks: {
          disconnect: {id: blogId} // removes the post from bookmarks
        }
      },
      select: {
        id: true,
        bookmarks: true
      }
    });
  
    return c.json({
      message: "Post removed from bookmarks successfully",
      bookmarks: updateUser.bookmarks
    },200)
  } catch(err) {
    return c.json({ error: "Something went wrong", err}, 500)
  }  
})

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