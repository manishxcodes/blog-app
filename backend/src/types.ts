import { z } from 'zod'

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

export interface PrismaClientError {
    name: string;                   // Name of the error
    code: string;                   // Error code (e.g., "P2002")
    clientVersion: string;          // Version of the Prisma client
    meta: {
        modelName: string;          // Name of the model (e.g., "User")
        target: string[];           // Array of fields causing the error (e.g., ["username"])
    };
}
