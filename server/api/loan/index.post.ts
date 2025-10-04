export default defineEventHandler((event) => {
  console.log("POST /api/loan");
  return { message: "POST loan" };
});
