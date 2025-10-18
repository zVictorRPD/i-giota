export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useAuth(); 
  if (!loggedIn.value && to.path !== "/auth/login" && to.path !== "/auth/register") {
    return navigateTo("/auth/login");
  }
});
