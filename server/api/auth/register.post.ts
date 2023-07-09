import { z } from "zod";

import { userSchema } from "../../../interface/App";
import { AppError, createServerError } from "../../../interface/AppError";
import prisma from "../../db";
import { generateAccessToken } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
    try {
        type BodyType = z.infer<typeof userSchema>;
        const body = await readBody<BodyType>(event);
        const validate = validator(userSchema, body);
        if (!validate.success) {
            throw new AppError(422, "Invalid Params", validate.error.message);
        }

        const userExist = await prisma.user.findUnique({ where: { email: body.email } });
        if (userExist) {
            throw new AppError(422, "Email already registered");
        }

        const hashedPassword = await generateHashedPassword(body.password);
        const diseases = await prisma.disease.findMany({ where: { id: { in: body.diseaseIds } }, select: {id: true} });
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                fullName: body.fullName,
                diseaseIds: diseases.map(disease => disease.id)
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                type: true,
                diseaseIds: true
            }
        });

        const token = generateAccessToken(newUser.id);

        return {
            success: true,
            token,
            user: newUser
        };
    } catch (err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});