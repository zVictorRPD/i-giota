import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { loans, parcels } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const userPayload = requireAuth(event);
  const userId = Number(userPayload.id);
  try {
    const query = getQuery(event);
    const loanId = query.id as string;
    const loandIdNumber = Number(loanId);
    if(isNaN(loandIdNumber)) throw createError({ statusCode: 400, statusMessage: "Loan ID is required" });
    const loan = await db
      .select()
      .from(loans)
      .where(and(eq(loans.id, loandIdNumber), eq(loans.userId, userId)))
      .get();
    const parcelsFromLoan = await db
      .select()
      .from(parcels)
      .where(eq(parcels.loanId, loandIdNumber));
    const receivedValue = parcelsFromLoan.reduce(
      (acc, parcel) => acc + parcel.paidValue,
      0
    );
    const totalToReceive = parcelsFromLoan.reduce(
      (acc, parcel) => acc + parcel.value,
      0
    );
    return {
      success: true,
      loan,
      totalToReceive,
      receivedValue,
      parcels: parcelsFromLoan,
    };
  } catch (error) {
    console.error("Error getting loan:", error);
    return {
      success: false,
      loan: null,
      parcels: null,
      totalToReceive: 0,
      receivedValue: 0,
      error,
    };
  }
});
