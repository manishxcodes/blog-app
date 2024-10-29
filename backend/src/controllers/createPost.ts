import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const createPost = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const formData = await c.req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const published = formData.get('published') === 'true' ? true : false;

          // Validate title and content
        if (typeof title !== 'string' || typeof content !== 'string' || !title.trim() || !content.trim()) {
            return c.json({ error: 'Invalid or missing title/content' }, 400);
        }
        console.log(title)
        // create post 
        const blog = await prisma.post.create({
            data: {
                title: title,
                content: content,
                published: published,
                authorId: c.get('userId')
            }
        })

        if(!blog) {
            return c.json({ error: 'Error while posting the blog'}, 500)
        }

        return c.json({ message: 'Sucessfully posted the blog', blog: blog}, 200);

    } catch (err) {
        return c.json({error: "Something went wrong.", err}, 500)
    }
}