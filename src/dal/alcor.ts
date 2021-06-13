export const enum ALCOR_MARKET {
  AETHER = 29,
  WECAN = 41,
  CAPON = 43,
  ENEFT = 45,
  WAXON = 42,
}

export interface AlcorPrice {
  last_price: number;
}

export async function getAlcorPrice(market: number): Promise<AlcorPrice> {
  const url = `https://wax.alcor.exchange/api/markets/${market}`;
  const res = await fetch(url);
  return res.json();
}
