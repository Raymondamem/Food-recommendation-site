import { User } from "@prisma/client";
import { AppError, createServerError } from "../../../interface/AppError";
import prisma from "../../db";

export default defineEventHandler(async (event) => {
    try {
        const user: User = event.context.user;
        if ( !user) {
            throw new AppError(401, "Not Authorize");
        }

        const { recommend } = getQuery(event) as {recommend: "YES" | "NO"};
        // console.log(user);
        if (recommend === "YES") {
            const foods = await prisma.food.findMany({where: {NOT: {diseaseIds: {hasEvery: user.diseaseIds}}}});
            // console.log(foods);
            return foods;
        }
        const foods = await prisma.food.findMany();

        return foods;
    } catch(err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});