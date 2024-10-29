import { createPostSchema } from "@manishxcode/blogapp-common";
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

        // zod validation 
        const response = createPostSchema.safeParse({title, content, published})
        if(!response.success) {
            // extracting error message from zod error object
            const errorMessage = response.error.errors.map( err => err.message)

            return c.json({
                message: "incorrect inputs",
                error: errorMessage
            }, 400);
        }

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