import type { PoolConfig, Rarity, RarityConfig, RateMod } from "../dal/rplanet";
import { atomicMarket, ListingAsset } from "../dal/atomic-market";
export type { ListingAsset } from "../dal/atomic-market";
export type { PoolConfig, RarityConfig } from "../dal/rplanet";

export const RPLANET_COLLECTION = "rplanet";

export interface RarityYield {
  rarity: string;
  aetherYield: number;
  collection: string;
  schema: string;
}

export async function findAsset(assetId: string): Promise<ListingAsset> {
  try {
    const id = assetId.replace("#", "").trim();
    const asset = await atomicMarket().getAsset(id);
    if (!asset) {
      throw "Asset not found";
    }
    return asset;
  } catch (err) {
    throw "Asset not available";
  }
}

export async function calculateRPlanetAssetYield(
  asset: ListingAsset,
  schemaRarityConf: RarityConfig,
  rateMods: Map<number, RateMod>
): Promise<number> {
  const schema = asset.schema.schema_name;
  const rarityConf = findAssetRarity(
    asset,
    RPLANET_COLLECTION,
    schema,
    schemaRarityConf
  );
  if (schema.startsWith("rigs")) {
    return rarityConf.one_asset_value / 10000;
  } else if (schema.startsWith("elements")) {
    const template = asset.template.template_id as any;
    const rateMod = rateMods.get(Number.parseFloat(template));
    if (!rateMod) {
      throw `Template ID [${template}] not found on RPlanet ratemods configuration`;
    }
    return (rarityConf.one_asset_value * rateMod.modifier) / 10000000;
  } else {
    throw `Schema [${schema}] of [${RPLANET_COLLECTION}] collection is not stakeable or we don't implemented it yet!`;
  }
}

export async function calculatePooledAssetYield(
  asset: ListingAsset,
  schemaRarityConf: RarityConfig,
  pools: Map<string, PoolConfig>
): Promise<{
  assetYield: number;
  otherRaritiesYield: RarityYield[];
}> {
  const collection = asset.collection.collection_name;
  const schema = asset.schema.schema_name;
  const pool = pools.get(asset.collection.collection_name);
  if (!pool) {
    throw "No pool found for this collection :(";
  }
  const rarity = findAssetRarity(asset, collection, schema, schemaRarityConf);
  const raritiesYield = raritiesYieldForSchema(schemaRarityConf, pool);
  return {
    assetYield: pooledYieldForRarity(rarity, pool),
    otherRaritiesYield: raritiesYield,
  };
}

export function raritiesYieldForSchema(
  rarityConf: RarityConfig,
  pool: PoolConfig
): RarityYield[] {
  return rarityConf.rarities
    .map((rar) => {
      return {
        rarity: rar.rarity,
        aetherYield: pooledYieldForRarity(rar, pool),
        collection: rarityConf.collection,
        schema: rarityConf.schema,
      };
    })
    .sort((a, b) => a.aetherYield - b.aetherYield);
}

function pooledYieldForRarity(rarity: Rarity, pool: PoolConfig): number {
  const fraction = Number.parseFloat(pool.fraction.split(" ")[0]) * 10000;
  const assetValue = rarity.one_asset_value;
  const staked = pool.staked * 10000;
  return (assetValue * fraction) / (staked + assetValue);
}

export function findSchemaRarity(
  asset: ListingAsset,
  rarities: RarityConfig[]
): RarityConfig {
  const collection = asset.collection.collection_name;
  const schema = asset.schema.schema_name;
  const schemaRarityConf = rarities.find(
    (rar) => rar.collection === collection && rar.schema === schema
  );
  if (!schemaRarityConf) {
    throw `Schema [${schema}] was not found in [${collection}] collection configuration for RPlanet :(`;
  }
  return schemaRarityConf;
}

function findAssetRarity(
  asset: ListingAsset,
  collection: string,
  schema: string,
  schemaRarityConf: RarityConfig
): Rarity {
  const assetRarity = asset.data[schemaRarityConf.rarity_id];
  const rarityConf = schemaRarityConf.rarities.find(
    (rar) => rar.rarity === assetRarity
  );
  if (!rarityConf) {
    throw `Rarity [${assetRarity}] was not found in RPlanet configuration for collection [${collection}] and schema [${schema}] :(`;
  }
  return rarityConf;
}
