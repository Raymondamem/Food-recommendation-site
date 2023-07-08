import { User } from "@prisma/client";
import { diseaseSchema } from "../../../interface/App";
import { AppError, createServerError } from "../../../interface/AppError";
import prisma from "../../db";
import { validator } from "../../utils/validator";

export default defineEventHandler(async (event) => {
    try {
        const user: User = event.context.user;
        if ( !user) {
            throw new AppError(401, "Not Authorize");
        }

        if (user.type !== "ADMIN") {
            throw new AppError(401, "Not Authorize");
        }
        const body = await readBody<{name: string}>(event);

        const validate = validator(diseaseSchema, body);
        if (!validate.success) {
            throw new AppError(422, "Invalid Params", validate.error.message);
        }

        const newDisease = await prisma.disease.create({data: {
            name: body.name
        }});

        return {
            success: true,
            newDisease
        };
    } catch(err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});