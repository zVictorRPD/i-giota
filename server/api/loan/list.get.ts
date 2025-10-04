export default defineEventHandler((event) => {
  console.log("GET /api/loan/list");
  return { message: "List loans" };
});
