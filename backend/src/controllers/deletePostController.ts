import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const deletePost = async (c: Context) => {
    try {
        const blogId = c.req.param('id');
        const userId = c.get('userId')
      
        // check if id is provided 
        if(!blogId) {
            return c.json({ error: 'Blog Id is required'}, 400)
        }
      
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
      
         // check if the blog exists and belongs to the current user
        const isExistingBlog = await prisma.post.findUnique({
            where: {
                id: blogId,
            },
            select: {
                authorId: true,
            }
        });
      
        if(!isExistingBlog) {
            return c.json({ error: "Blog not found"}, 404);
        }
  
        // check the blog belong to the authenticated user
        if( isExistingBlog.authorId !== userId) {
            return c.json({ error: "Unauthorised to delete this blog"}, 403)
        }
    
        const deletedPost = await prisma.post.delete({
            where: {
            id: blogId
            }
        });
        return c.json({ message: "Blog post deleted successfully", deletedPost}, 200)
    } catch(err) {
        return c.json({ error: 'An error occured while deleting the post', err}, 500)
    }
}