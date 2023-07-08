import jwt from "jsonwebtoken";


const config = useRuntimeConfig();
type JWT_TYPE = string | object | Buffer;

export const generateAccessToken = (data: JWT_TYPE, options?: jwt.SignOptions) => {
    return jwt.sign({data}, config.jwtStrategySecret, {expiresIn: "5h"});
}

export const decodeAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, config.jwtStrategySecret);
        return decoded;
    } catch (err) {
        return null;
    }
}