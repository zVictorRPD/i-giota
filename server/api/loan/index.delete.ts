export default defineEventHandler((event) => {
  console.log("Delete /api/loan");
  return { message: "Delete loan" };
});
