import {
  fetchRarityConfigs,
  fetchRateMods,
  fetchStakingConfigs,
  PoolConfig,
  RarityConfig,
  RateMod,
} from "../dal/rplanet";
import { readable } from "svelte/store";

function createPoolsStakingConfigStore() {
  const internalPromise = fetchStakingConfigs().then(
    (config) => new Map(config.map((col) => [col.id, col]))
  );
  const internal = readable<Map<string, PoolConfig>>(new Map(), (set) => {
    internalPromise.then((config) => set(config));
  });
  return {
    subscribe: internal.subscribe,
    promise: internalPromise,
  };
}

export const poolsStakingConfigStore = createPoolsStakingConfigStore();

function createRarityConfigStore() {
  const internalPromise = fetchRarityConfigs();
  const internal = readable<RarityConfig[]>([], (set) => {
    internalPromise.then((rars) => set(rars));
  });
  return {
    subscribe: internal.subscribe,
    promise: internalPromise,
  };
}

export const rarityConfigStore = createRarityConfigStore();

function createRateModsStore() {
  const internalPromise = fetchRateMods();
  const internal = readable<Map<number, RateMod>>(
    new Map<number, RateMod>(),
    (set) => {
      internalPromise.then((mods) => set(mods));
    }
  );
  return {
    subscribe: internal.subscribe,
    promise: internalPromise,
  };
}

export const rateModsStore = createRateModsStore();

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
