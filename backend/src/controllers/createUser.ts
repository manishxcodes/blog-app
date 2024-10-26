import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { userSignupSchema } from "../types";
import bcrypt from 'bcryptjs'

export const createUser = async( c: Context ) => {
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
        })
    
        return c.json({ message: 'User Created Successfully' })
    
        } catch (error) {
            console.error('Error during signup:', error)
            return c.json({ message: 'An error occurred during signup' }, 500)
        } 
}