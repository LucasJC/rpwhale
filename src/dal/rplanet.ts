import { getTableRows } from "./wax-chain";

export interface PoolConfig {
  id: string;
  staked: number;
  pending_staked: number;
  stock: string;
  fraction: string;
  enabled: number;
}

export interface RarityConfig {
  id: string;
  contract: "simpleassets" | "atomicassets" | string;
  author: string;
  collection: string;
  schema: string;
  name_id: string;
  rarity_id: string;
  img_id: string;
  rarities: Rarity[];
}
export interface Rarity {
  rarity: string;
  uniq_assets: number;
  one_asset_value: number;
  collection_value: number;
}

export interface AccountCollectionStaking {
  collection: string;
  user: string;
  staked: number;
  collected: string;
  miningPower?: number;
}

export interface RateMod {
  id: number;
  modifier: number;
}

export async function fetchRarityConfigs(): Promise<RarityConfig[]> {
  const r = await getTableRows<RarityConfig>(
    "s.rplanet",
    "s.rplanet",
    "collections"
  );
  return r.rows;
}

export async function fetchStakingConfigs(): Promise<PoolConfig[]> {
  const r = await getTableRows<PoolConfig>("s.rplanet", "s.rplanet", "pools");
  return r.rows;
}

export async function fetchRateMods(): Promise<Map<number, RateMod>> {
  const map = new Map<number, RateMod>();
  let mods;
  let nextKey;
  do {
    mods = await getTableRows<RateMod>(
      "s.rplanet",
      "atomicassets",
      "ratemods",
      nextKey
    );
    for (let rm of mods.rows) {
      map.set(rm.id, rm);
    }
    nextKey = mods.next_key?.toString();
  } while (nextKey);
  return map;
}

export async function fetchAccountCollectionStaking(
  account: string,
  collection: string
): Promise<AccountCollectionStaking | undefined> {
  const result = await getTableRows<AccountCollectionStaking>(
    "s.rplanet",
    collection,
    "accounts",
    account,
    account
  );
  const staking = result.rows[0];
  if (staking) {
    staking.collection = collection;
  }
  return staking;
}
