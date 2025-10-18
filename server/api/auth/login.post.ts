import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "~/db";
import { users } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Credenciais ausentes.",
      });
    }

    // 1. Encontrar o usuário
    const userQuery = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!userQuery || userQuery.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: "Credenciais inválidas.",
      });
    }

    const user = userQuery[0];

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Credenciais inválidas.",
      });
    }

    const secret = process.env.JWT_SECRET || "super-secret-key-for-dev";

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    return error;
  }
});
