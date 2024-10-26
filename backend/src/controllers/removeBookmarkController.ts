import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const removeBookmark = async (c: Context) => {
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
}