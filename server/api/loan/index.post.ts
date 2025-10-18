import { db } from "~/db";
import { loans, parcels } from "~/db/schema";
import { removeMask } from "~/utils/masks";

export default defineEventHandler(async (event) => {
  const input = await readBody(event);
  const userPayload = requireAuth(event);
  const userId = Number(userPayload.id);
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
    const res = await db
      .insert(loans)
      .values({
        name: input.name,
        totalValue: parsedTotalValue,
        isFixed: true,
        installments: Number(input.installments),
        interestRate: Number(input.interest_rate),
        startDate: input.start_date,
        userId: Number(userId),
      })
      .returning();

    const resultado = [];
    const amortizacao = Math.round(
      parsedTotalValue / Number(input.installments)
    );
    let saldoDevedor = parsedTotalValue;
    const now = new Date().toISOString();
    let paidValue = 0;

    for (let i = 1; i <= Number(input.installments); i++) {
      const juros = Math.round((saldoDevedor * input.interest_rate) / 100);
      const value = amortizacao + juros;

      const due = new Date(input.start_date);
      due.setMonth(due.getMonth() + (i - 1));
      const dueDate = due.toISOString().split("T")[0];

      resultado.push({
        value: value,
        paidValue: paidValue,
        dueDate: dueDate,
        paidAt: null,
        loanId: res[0].id,
      });
      saldoDevedor -= amortizacao;
    }

    await db.insert(parcels).values(resultado);

    return { success: true, loan: res[0], parcels: resultado };
  } catch (error) {
    console.error("Error inserting loan:", error);
    return { success: false, error };
  }
});
