export default defineEventHandler((event) => {
  setCookie(event, "auth_token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });

  return { message: "Logout bem-sucedido" };
});
