import { User } from "@prisma/client";
import { AppError, createServerError } from "../../../interface/AppError";
import prisma from "../../db";

export default defineEventHandler(async (event) => {
    try {
        const user: User = event.context.user;
        if (!user) {
            throw new AppError(401, "Not Authorize");
        }

        const { q } = getQuery(event) as { q: string };
        const foods = await prisma.food.findMany({
            where: {
                NOT: { diseaseIds: { hasEvery: user.diseaseIds } },
            }
        });
        
        const filteredFood = foods.filter(f => f.name.includes(q));
        return filteredFood;
    } catch (err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});