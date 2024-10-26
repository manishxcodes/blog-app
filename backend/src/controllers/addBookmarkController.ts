import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const addBookmark = async (c: Context) => {   
    try {
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
}