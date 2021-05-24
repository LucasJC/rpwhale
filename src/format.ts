export function format(input: number) {
  const numberToFormat = input || 0;
  return numberToFormat.toLocaleString('en-us', { minimumFractionDigits: 2 });
}