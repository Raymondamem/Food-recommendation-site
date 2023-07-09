import { AppError, createServerError } from "../../../interface/AppError";
import prisma from "../../db";
import { compareHashedPassword } from "../../utils/generateHashedPassword";
import { generateAccessToken } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
    try {
        type BodyType = {email: string, password: string};
        const body = await readBody<BodyType>(event);

        const user = await prisma.user.findUnique({where: {email: body.email}});
        if (!user) {
            throw new AppError(422, "User not found");
        }

        const isSame = compareHashedPassword(body.password, user.password);
        if (!isSame) {
            throw new AppError(422, "Passwords do not match");
        }

        const token = generateAccessToken(user.id);

        return {
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                type: user.type,
                diseaseIds: user.diseaseIds
            }
        }

    }catch(err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});