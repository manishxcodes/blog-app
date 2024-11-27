import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const fetchAllPost = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
        
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                published: true,
                createdAt: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // formating the posts 
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            published: post.published,
            createdAt: post.createdAt,
            authorName: post.author.name, // Flatten the author name
        }));

        
        return c.json({formattedPosts})
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

export const fetchUserPost = async (c: Context) => {
    try {
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
    } catch(err) {
        return c.json({error: "Something went wrong. Can't fetch your post", err}, 500)
    }
}