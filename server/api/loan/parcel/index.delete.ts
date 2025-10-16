import { eq } from "drizzle-orm";
import { db } from "~/db";
import { parcels } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const parcelId = Number(getQuery(event).id as string);
  
  // const parcelId = input.id;
  if (!parcelId) {
    return { success: false, error: "O Id da parcela é obrigatório" };
  }
  try {
    const parcel = await db
      .select()
      .from(parcels)
      .where(eq(parcels.id, parcelId))
      .limit(1);
    if (parcel.length === 0) {
      return {
        success: false,
        error:
          "Parcela não encontrada ou você não tem permissão para deletá-la.",
      };
    }
    await db.delete(parcels).where(eq(parcels.id, parcelId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting loan parcel:", error);
    return { success: false, error };
  }
});
