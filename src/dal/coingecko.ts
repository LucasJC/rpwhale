export interface WaxPrice {
  wax: {
    usd: number;
  };
}

export async function getWaxPriceInUSD(): Promise<WaxPrice> {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd";
  const res = await fetch(url);
  return res.json();
}
