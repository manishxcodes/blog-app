import { MiddlewareHandler } from "hono"
import { verify } from "hono/jwt"

export const authMiddleware:MiddlewareHandler = async (c, next) => {
    const authToken = c.req.header('Authorization')
    if(!authToken) {
        c.status(401)
        return c.json({ error: "unauthorized" })
    } 

    const token = authToken.split(' ')[1]
    const payload = await verify(token, c.env.JWT_SECRET)
    if(!payload) {
        c.status(401)
        return c.json({ error: "unauthorized"})
    }
    c.set('userId', payload.id)
    await next()
}