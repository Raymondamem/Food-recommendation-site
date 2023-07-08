import { z } from "zod";

import { User } from "@prisma/client";
import { AppError, createServerError } from "../../../interface/AppError";
import { foodSchema } from "../../../interface/App";
import prisma from "../../db";

export default defineEventHandler(async (event) => {
    try {
        const user: User = event.context.user;
        if ( !user) {
            throw new AppError(401, "Not Authorize");
        }

        if (user.type !== "ADMIN") {
            throw new AppError(401, "Not Authorize");
        }

        type BodyType = z.infer<typeof foodSchema>;
        const body = await readBody<BodyType>(event);
        const validate = validator(foodSchema, body);
        if (!validate.success) {
            throw new AppError(422, "Invalid Params", validate.error.message);
        }

        const diseases = await prisma.disease.findMany({ where: { id: { in: body.diseases } }, select: {id: true} });
        const food = await prisma.food.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                diseaseIds: diseases.map((disease) => disease.id)
            }
        });

        return food;
    } catch(err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});