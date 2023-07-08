import UrlPattern from "url-pattern";

import prisma from "../db";
import { decodeAccessToken } from "../utils/jwt";

export default defineEventHandler(async (event) => {
    const endpoints = [
        "/api/auth/user",
        "/api/data/disease",
        "/api/data/food"
    ];

    const isHandledMyThisMiddleware = endpoints.some(endpoint => {
        const pattern = new UrlPattern(endpoint);

        if (!event.node.req.url) return false;
        return pattern.match(event.node.req.url);
    });

    if (isHandledMyThisMiddleware) {
        const token = event.node.req.headers.authorization?.split(" ")[1];

        if (token) {
            const decodedToken: any = decodeAccessToken(token);
            if (decodedToken) {
                const user = await prisma.user.findUnique({ where: { id: decodedToken.data } });
                event.context.user = user;
            }
        }
    }
});