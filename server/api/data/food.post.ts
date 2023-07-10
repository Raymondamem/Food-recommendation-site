import { z } from "zod";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import { dirname, join, extname } from "path";
import { unlink } from "fs";
import { fileURLToPath } from "url";

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

        const __dirname = dirname(fileURLToPath(import.meta.url));
        const uploadDir = join(__dirname, "../../public/uploads");
        type BodyType = z.infer<typeof foodSchema>;
        // const body = await readBody<BodyType>(event);
        const form = formidable({ 
            uploadDir,
            filename: (name: any, ext: any, part: any, form: any) => {
                const { originalFilename } = part;
                return `${uuidv4()}${extname(originalFilename)}`;
            }
        });
        const [fields, files] = await form.parse(event.node.req);
        const body: BodyType = {
            name: fields.name[0],
            price: parseFloat(fields.price[0]),
            diseaseIds: JSON.parse(fields.diseaseIds[0])
        };
        const validate = validator(foodSchema, body);
        if (!validate.success) {
            unlink(`${files.image[0].filepath}`, (err) => {
                console.log("Deleted");
            });
            // console.log(validate.error.message);
            throw new AppError(422, "Invalid Params", validate.error.message);
        }

        const diseases = await prisma.disease.findMany({ where: { id: { in: body.diseaseIds } }, select: {id: true} });
        const food = await prisma.food.create({
            data: {
                name: body.name,
                price: body.price,
                diseaseIds: diseases.map((disease) => disease.id),
                imagePath: files.image[0].newFilename
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