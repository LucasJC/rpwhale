import { fetchStakingConfigs, PoolConfig } from "../dal/rplanet";
import { readable } from "svelte/store";

export const poolsStakingConfigStore = readable<Map<string, PoolConfig>>(
  new Map(),
  (set) => {
    fetchStakingConfigs().then((config) =>
      set(new Map(config.map((col) => [col.id, col])))
    );
  }
);

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
