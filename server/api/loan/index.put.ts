export default defineEventHandler((event) => {
  console.log("PUT /api/loan");
  return { message: "PUT loan" };
});
