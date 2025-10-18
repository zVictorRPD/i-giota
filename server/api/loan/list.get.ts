import { eq } from "drizzle-orm";
import { db } from "~/db";
import { loans, parcels } from "~/db/schema";
import type { IListResponse } from "~/interfaces/loan";
import { requireAuth } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  const userPayload = requireAuth(event);
  const userId = Number(userPayload.id);
  try {
    const rawResults = await db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId))
      .leftJoin(parcels, eq(loans.id, parcels.loanId))
      .all();

    // Organize the parcels under each loan
    const loansMap = new Map();
    for (const row of rawResults) {
      const loan = row.loans;
      const parcel = row.parcels;

      if (!loansMap.has(loan.id)) {
        loansMap.set(loan.id, {
          ...loan,
          parcels: parcel && parcel.id ? [parcel] : [],
        });
      } else if (parcel && parcel.id) {
        loansMap.get(loan.id).parcels.push(parcel);
      }
    }
    const allLoans = Array.from(loansMap.values());
    const formattedResponse = allLoans.map((loan) => {
      const parcelsTotalPaid = loan.parcels.reduce(
        (accumulator: number, parcel: any) => accumulator + parcel.paidValue,
        0
      );

      const nextPayment = loan.parcels.find((parcel: any) => !parcel.paidDate);

      return {
        id: loan.id,
        name: loan.name,
        totalValue: loan.totalValue,
        parcelsTotalPaid,
        nextPayment: nextPayment?.dueDate || null,
      };
    }) as IListResponse[];

    return { success: true, loans: formattedResponse };
  } catch (error) {
    console.error("Error listing loans:", error);
    return { success: false, loans: [] as IListResponse[], error };
  }
});
