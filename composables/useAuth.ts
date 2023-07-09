import { User } from "@prisma/client";

type UserI = Omit<User, "password">;
type LoginI = Pick<User, "email" | "password">;
type RegisterI = Pick<User, "email" | "password" | "fullName" | "diseaseIds">;

export default () => {
    const useUser = () => useState<UserI | null>("user", () => null);
    const useAccessToken = () => useState<string | null>("token", () => "");

    const setAccessToken = (newAccessToken: string | null) => {
        const accessToken = useAccessToken();
        accessToken.value = newAccessToken;
    }

    const setUser = (newUser: UserI | null) => {
        const user = useUser();
        user.value = newUser;
    }

    const login = async (body: LoginI) => {
        const data = await $fetch("/api/auth/login", {
            method: "post",
            body
        });

        setUser(data.user);
        setAccessToken(data.token);
        return true;
    }

    const register = async(body: RegisterI) => {
        const data = await $fetch("/api/auth/register", {
            method: "post",
            body
        });

        setUser(data.user);
        setAccessToken(data.token);
        return true;
    }

    const logout = async () => {
        // const token = useAccessToken();
        // await $fetch("/api/v2/auth/logout", {
        //     headers: {
        //         authorization: `Bearer ${token.value}`
        //     },
        // });
        setUser(null);
        setAccessToken(null);
        navigateTo("/users/signin");
    }

    const fetchUser = async () => {
        const token = useAccessToken();
        const data = await $fetch("/api/auth/user", {
            headers: {
                authorization: `Bearer ${token.value}`
            },
        });

        setUser(data);
    }

    const initAuth = async () => {
        await fetchUser();
    }

    return {
        useUser,
        login,
        register,
        logout,
        initAuth
    }
}