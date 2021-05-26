export function format(input: number | undefined) {
  const numberToFormat = input || 0;
  return numberToFormat.toLocaleString("en-us", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}
