import { z } from "zod/v4"

export const registerSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    gender: z.string(),
    age: z.number(),
    weight: z.number(),
    height: z.number(),
    fat_percentage: z.number().optional(),
})

export const loginSchema = z.object({
    email: z.email(),
    passwrod: z.string(),
})
