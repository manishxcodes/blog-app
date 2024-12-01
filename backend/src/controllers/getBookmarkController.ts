import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const getBookmark = async (c: Context) => {
    try {
        const userId = c.get('userId');

        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
      
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            bookmarks: {
              select: {
                id: true,
                title: true,
                content: true,
                author: {
                  select: {
                    name: true
                  },
                },
                createdAt: true
              }
            }
          }
        });
      
        if(!user || user.bookmarks.length == 0) {
          return c.json({message: "No bookmarks"}, 204)
        }
      
        return c.json({bookmarks: user.bookmarks});  
      
    } catch(err) {
        return c.json({error: "something went wrong", err}, 500)
    }
}