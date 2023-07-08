import { z } from "zod";

export const diseaseSchema = z.object({
    name: z.string()
});

export const  userSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    diseases: z.array(z.string())
});

export const foodSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    diseases: z.array(z.string())
});
