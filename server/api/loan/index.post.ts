import { db } from "~/db";
import { loans } from "~/db/schema";
import { removeMask } from "~/utils/masks";

export default defineEventHandler(async (event) => {
  const input = await readBody(event);
  const userId = JSON.parse(parseCookies(event).user || "{}").id;
  const parsedTotalValue = Number(removeMask(input.total_value));

  if (!input.is_fixed) {
    try {
      const res = await db
        .insert(loans)
        .values({
          userId: Number(userId),
          name: input.name,
          totalValue: parsedTotalValue,
          isFixed: input.is_fixed,
        })
        .returning();
      return { success: true, loan: res[0] };
    } catch (error) {
      console.error("Error inserting loan:", error);
      return { success: false, error };
    }
  }

  try {
    const res = await db.insert(loans).values({
      name: input.name,
      totalValue: parsedTotalValue,
      isFixed: true,
      installments: Number(input.installments),
      interestRate: Number(input.interest_rate),
      startDate: input.start_date,
      userId: Number(userId),
    }).returning();
    return { success: true, loan: res[0] };
  } catch (error) {
    console.error("Error inserting loan:", error);
    return { success: false, error };
  }

  return { success: true };
});
