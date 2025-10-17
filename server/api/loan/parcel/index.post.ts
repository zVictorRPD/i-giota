import { eq } from "drizzle-orm";
import { db } from "~/db";
import { parcels } from "~/db/schema";
import { removeMask } from "~/utils/masks";

export default defineEventHandler(async (event) => {
  const input = await readBody(event);
  const paidAt = new Date().toISOString();
  const paidValue = Number(removeMask(input.paidValue));
  console.log(input.parcelId);
  
  if (input.parcelId) {
    try {
      const parcel = await db
        .update(parcels)
        .set({
          paidValue,
          dueDate: input.dueDate,
          paidAt,
        })
        .where(eq(parcels.id, input.parcelId));
      return { success: true, parcel };
    } catch (error) {
      console.error("Error updating loan parcel:", error);
      return { success: false, error };
    }
  }

  try {
    await db.insert(parcels).values({
      loanId: input.loanId,
      paidValue,
      dueDate: input.dueDate,
      value: paidValue,
      paidAt,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting loan parcel:", error);
    return { success: false, error };
  }
});
