export function removeMask(value: string | undefined) {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

export function moneyMask(value: string | undefined) {
  if (!value) return undefined;
  const numericValue = Number(removeMask(value));
  if (isNaN(numericValue)) return undefined;

  return (numericValue / 100).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}
