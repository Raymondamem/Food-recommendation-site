import bcrypt from "bcryptjs";

export const generateHashedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

export const compareHashedPassword = async (password: string, hashed: string) => {
    const isSame = await bcrypt.compare(password, hashed);
    return isSame;
}
