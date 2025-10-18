import { hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { users } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, name } = body;

    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email e senha são obrigatórios.",
      });
    }

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (userExists && userExists.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "Um usuário com este email já existe.",
      });
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    return {
      statusCode: 201,
      message: "Usuário registrado com sucesso.",
    };
  } catch (error) {
    return error;
  }
});
