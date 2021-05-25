export async function getCurrencyBalance(
  account: string
): Promise<Array<string>> {
  const url = "https://api.wax.alohaeos.com/v1/chain/get_currency_balance";
  const options = {
    method: "POST",
    body: JSON.stringify({
      code: "e.rplanet",
      account,
    }),
  };
  const res = await fetch(url, options);
  return res.json();
}
