import { User } from "@prisma/client";
import { AppError, createServerError } from "../../../interface/AppError";
import prisma from "../../db";

export default defineEventHandler(async (event) => {
    try {
        const diseases = await prisma.disease.findMany();

        return diseases;
    } catch(err: any) {
        if (err instanceof AppError) {
            sendError(event, createServerError(err.statusCode, err.message, err.errorObject));
        }

        sendError(event, createServerError(500, err.message || "An Error occured"));
    }
});