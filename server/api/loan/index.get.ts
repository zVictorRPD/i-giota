export default defineEventHandler((event) => {
  console.log("GET /api/loan");
  return { message: "Get loan" };
});
