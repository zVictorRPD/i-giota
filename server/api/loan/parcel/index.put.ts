
export default defineEventHandler(async (event) => {
  const input = await readBody(event);
  const userPayload = requireAuth(event);
  const userId = Number(userPayload.id);
  const parcelId = input.id;
  if (!parcelId) {
    return { success: false, error: "O Id da parcela é obrigatório" };
  }
});
