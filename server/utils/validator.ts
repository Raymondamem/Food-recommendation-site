import { z, ZodType } from "zod";

export const validator = <T>(schema: ZodType<T>, payload: unknown) => {
    return schema.safeParse(payload);
};