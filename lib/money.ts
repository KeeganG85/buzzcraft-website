export function formatZar(amount: number): string {
  const [whole, fraction] = amount.toFixed(2).split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (fraction === "00") return `R${withCommas}`;
  return `R${withCommas}.${fraction}`;
}
