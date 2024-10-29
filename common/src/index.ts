import { z } from "zod"

export const userSignupSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    username: z.string(),
    name: z.string()    // fullname
})

export const userSigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const createPostSchema = z.object({
    title: z.string().min(1, {message: "Title required"}),
    content: z.string().min(1, {message: "Content is required"}),
    published: z.boolean().optional()
})

export const updatePostSchema = z.object({
    title: z.string().min(1, {message: "Title required"}),
    content: z.string().min(1, {message: "Content is required"}),
    blogId: z.string().uuid()   // ensures string is valid uuid
})

// type inference: // This creates a TypeScript type from the `userSignupSchema` schema.
export type SignupSchema = z.infer<typeof userSignupSchema>
export type SigninSchema = z.infer<typeof userSigninSchema>
export type CreatePostSchema = z.infer<typeof createPostSchema>
export type UpdatePostSchema = z.infer<typeof updatePostSchema>