import {
  fetchRarityConfigs,
  fetchStakingConfigs,
  PoolConfig,
  RarityConfig,
} from "../dal/rplanet";
import { readable } from "svelte/store";

export const poolsStakingConfigStore = readable<Map<string, PoolConfig>>(
  new Map(),
  (set) => {
    fetchStakingConfigs().then((config) =>
      set(new Map(config.map((col) => [col.id, col])))
    );
  }
);

export const rarityConfigStore = readable<RarityConfig[]>([], (set) => {
  fetchRarityConfigs().then((rars) => set(rars));
});

export async function getCurrencyBalance(
  account: string
): Promise<Array<string>> {
  if (!account) {
    return [];
  }
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
