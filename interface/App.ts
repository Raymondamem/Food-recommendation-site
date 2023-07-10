import { z } from "zod";

export const diseaseSchema = z.object({
    name: z.string()
});

export const  userSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string(),
    diseaseIds: z.array(z.string())
});

export const foodSchema = z.object({
    name: z.string(),
    price: z.number(),
    diseaseIds: z.array(z.string())
});
