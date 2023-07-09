export default defineNuxtRouteMiddleware((to, from) => {
    const { useUser } = useAuth();
    const user = useUser();
    if (!user.value) {
      return navigateTo("/users/signin");
    }

    if (user.value.type !== "ADMIN") {
      return navigateTo("/users/signin");
    }
});