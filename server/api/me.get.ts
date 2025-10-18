import jwt from "jsonwebtoken";
import { IUser } from "~/interfaces/user";

export default defineEventHandler((event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Não autenticado" });
  }

  try {
    // 2. Verificar o token JWT
    const secret = process.env.JWT_SECRET || "super-secret-key-for-dev";

    const decoded = jwt.verify(token, secret) as IUser;
    console.log("Token verificado com sucesso:", decoded);
    
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: "Token inválido" });
  }
});
