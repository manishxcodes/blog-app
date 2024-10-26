import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const fetchAllPost = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
        
        const posts = await prisma.post.findMany()
        return c.json({posts})
        } catch(err) {
            return c.json({error: "Unable to Fetch Post", err},404)
        }
} 

export const fetchPost = async (c: Context) => {
    try {
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
      
        return c.json({post: post}, 200)
    } catch(err) {
        return c.json({error: "Something went wrong. Unable to fetch post", err}, 500)
    }
}