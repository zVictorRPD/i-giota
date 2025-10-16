
export default defineEventHandler(async (event) => {
  const input = await readBody(event);
  const userId = JSON.parse(parseCookies(event).user || "{}").id;
  const parcelId = input.id;
  if (!parcelId) {
    return { success: false, error: "O Id da parcela é obrigatório" };
  }
});
