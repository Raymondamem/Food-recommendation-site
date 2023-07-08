import { User } from "@prisma/client";
import { AppError, createServerError } from "../../../interface/AppError";

export default defineEventHandler(async (event) => {
    try {
        const user: User = event.context.user;
        if ( !user) {
            throw new AppError(401, "Not Authorize");
        }

        if (user.type !== "ADMIN") {
            throw new AppError(401, "Not Authorize");
        }

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            type: user.type,
            diseases: user.diseaseIds
        };

    } catch (err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});