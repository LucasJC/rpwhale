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
  collection: string;
  schema: string;
  name_id: string;
  rarity_id: string;
  img_id: string;
  rarities: [{ 
    rarity: string, 
    uniq_assets: number, 
    one_asset_value: number, 
    collection_value: number 
  }];
}

export interface AccountCollectionStaking {
  collection: string;
  user: string;
  staked: number;
  collected: string;
  miningPower?: number;
}

export async function fetchRarityConfigs(): Promise<RarityConfig[]> {
  return getTableRows<RarityConfig>("s.rplanet", "s.rplanet", "collections");
}

export async function fetchStakingConfigs(): Promise<PoolConfig[]> {
  return getTableRows<PoolConfig>("s.rplanet", "s.rplanet", "pools");
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
  const staking = result[0];
  if (staking) {
    staking.collection = collection;
  }
  return staking;
}
