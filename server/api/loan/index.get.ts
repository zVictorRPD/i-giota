import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { loans, parcels } from "~/db/schema";

export default defineEventHandler( async (event) => {
  const userId = JSON.parse(parseCookies(event).user || "{}").id;
  console.log("User ID:", event.context);
  try {
    const query = getQuery(event)
    const loanId = query.id as string;
  if (!loanId) {
    return { success: false, error: "Loan ID is required" };
  }
  const loan = await db.select().from(loans).where(and(eq(loans.id, Number(loanId)), eq(loans.userId, userId))).get();
  const parcelsFromLoan = await db.select().from(parcels).where(eq(parcels.loanId, Number(loanId)));
  const receivedValue = parcelsFromLoan.reduce((acc, parcel) => acc + parcel.paidValue, 0);
  const totalToReceive = parcelsFromLoan.reduce((acc, parcel) => acc + parcel.value, 0);
  return { success: true, loan, totalToReceive, receivedValue, parcels: parcelsFromLoan };
} catch (error) {
  console.error("Error getting loan:", error);
  return { success: false, error };
}
});
