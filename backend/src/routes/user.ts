import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { userSignupSchema, userSigninSchema } from '../types'
import bcrypt, { hash } from 'bcryptjs'
import { sign } from 'hono/jwt'

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

// signup route
router.post('/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    console.log(body)

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

// other method
// router.post('/signup', async (c) => {
//   let prisma: PrismaClient 

//   try {
//     const datasourceUrl = c.env.DATABASE_URL;
//     if (!datasourceUrl) {
//       throw new Error("DATABASE_URL environment variable is not set.");
//     }

//     prisma = new PrismaClient({
//       datasources: {
//         db: {
//           url: datasourceUrl,
//         },
//       },
//     }).$extends(withAccelerate());

//     const body = await c.req.json();
//     console.log(body);

//     // Zod validation
//     const response = userSignupSchema.safeParse(body);
//     if (!response.success) {
//       return c.json({ message: 'Incorrect inputs' }, 400);
//     }

//     // Check if the user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email: body.email,
//       },
//     });
//     if (existingUser) {
//       return c.json({ message: 'User already exists' }, 400);
//     }

//     // Hash passwordn
//     const saltRounds = 10;
//     const plainTextPassword = body.password;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

//     // Create user
//     await prisma.user.create({
//       data: {
//         email: body.email,
//         password: hashedPassword,
//         username: body.username,
//         name: body.name,
//       },
//     });

//     return c.json({ message: 'User Created Successfully' });

//   } catch (error) {
//     console.error('Error during signup:', error);
//     return c.json({ message: 'An error occurred during signup' }, 500);
//   } finally {
//     if (prisma) {
//       await prisma.$disconnect();
//     }
//   }
// });

  
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
  console.log(isExistingUser.id)
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

router.get('/test', (c) => {
return c.text('test route')
})

export default router 