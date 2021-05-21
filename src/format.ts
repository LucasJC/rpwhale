export function format(input: number) {
  return input.toLocaleString('en-us', { minimumFractionDigits: 2 });
}