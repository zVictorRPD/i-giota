import { eq } from "drizzle-orm";
import { db } from "~/db";
import { parcels } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const input = await readBody(event);
  const parcelId = Number(input.parcelId);
  if (!parcelId) {
    return { success: false, error: "O Id da parcela é obrigatório" };
  }
  try {
    await db
      .update(parcels)
      .set({ paidAt: null, paidValue: 0 })
      .where(eq(parcels.id, parcelId));
    return { success: true };
  } catch (error) {
    console.error("Error canceling parcel:", error);
    return { success: false, error };
  }
});
