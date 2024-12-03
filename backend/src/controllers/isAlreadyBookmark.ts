import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const isAlreadyBookmark = async (c: Context) => {
    try {
        const blogId = c.req.param('id');
        const userId = c.get('userId');

        // check if id is there
        if(!blogId) {
            return c.json({error: 'Blog ID is required'}, 400)
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
            return c.json({error: 'Blog not found'}, 404);
        }

        // check if already bookmark
        const alreadyBookmarked = await prisma.user.findFirst({
            where: {
                id: userId,
                bookmarks: {
                    some: {
                        id: blogId
                    }
                }
            }
        })

        if(alreadyBookmarked) {
            return c.json({bookmarked: true}, 200)
        } else {
            return c.json({bookmarked: false}, 200)
        }
    }   catch (err) {
            return c.json({ error: 'Something went wrong', err}, 500)
    } 
}
