import type { IPricesInWax } from "../domain/store";

/**
 * get price in wax for a given token,
 * we are pretty flexible with the key you pass in.
 */
export function getPrice(prices: IPricesInWax, currency: string): number {
  const cur = currency.toUpperCase();
  if (cur.includes("AETHER")) {
    return prices.AETHER;
  }
  if (cur.includes("CAPON")) {
    return prices.CAPON;
  }
  if (cur.includes("ENEFT")) {
    return prices.CAPON;
  }
  if (cur.includes("WAXON")) {
    return prices.WAXON;
  }
  if (cur.includes("WECAN")) {
    return prices.WECAN;
  }

  console.warn("getPrice not found", currency, prices);
  return 0;
}
