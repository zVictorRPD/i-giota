export default defineNuxtPlugin({
  name: 'auth-server-plugin',
  enforce: 'pre',
  async setup (nuxtApp) {
    const { setUser } = useAuth();
    const token = useCookie("auth_token");
    if (token.value) {
      try {
        const userData = await $fetch("/api/me", {
          headers: nuxtApp.ssrContext?.event.node.req.headers as HeadersInit,
        });
        console.log("Usuário autenticado no lado do servidor:", userData);
        
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Falha ao buscar usuário no lado do servidor:", error);
      }
    }
  }
});
