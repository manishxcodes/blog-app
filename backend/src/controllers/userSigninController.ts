import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { SigninSchema, userSigninSchema } from "@manishxcode/blogapp-common";
import bcrypt from 'bcryptjs';
import { sign } from "hono/jwt";

export const userSigninController = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        
        const body = await c.req.json() as SigninSchema;
        console.log(body)
        
        // validation using zod 
        const response = userSigninSchema.safeParse(body)
        if(!response.success) {
            return c.json({message: "Invalid credentials"}, 400)
        }
        
        // verify user 
        const isExistingUser = await prisma.user.findFirst({
            where: {
              email: body.email
            }
        })
        if(!isExistingUser) {
            return c.json({message: 'Invalid credentials'}, 401)
        }
        
        //verify password
        const hashedPassword = isExistingUser.password
        const plainTextPassword = body.password
    
        const isPasswordCorrect = await bcrypt.compare(plainTextPassword, hashedPassword)
        if(isPasswordCorrect) {
            const token = await sign({id: isExistingUser.id}, c.env.JWT_SECRET)
            return c.json({token: token}, 200)
        } else {
            return c.json({message: "Invalid credentials"}, 401)
        }
    } catch(err) {
        return c.json({error: 'Error while logging in', err}, 500)
    }
}