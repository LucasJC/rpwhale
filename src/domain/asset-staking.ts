import type { PoolConfig, Rarity, RarityConfig, RateMod } from "../dal/rplanet";
import { atomicMarket, ListingAsset } from "../dal/atomic-market";
import { fetchSimpleAsset, SimpleAsset } from "../dal/simpleassets";
export type { ListingAsset } from "../dal/atomic-market";
export type { PoolConfig, RarityConfig } from "../dal/rplanet";

export const RPLANET_COLLECTION = "rplanet";

export interface RarityYield {
  rarity: string;
  aetherYield: number;
  collection: string;
  schema: string;
}

export interface StakeableAsset {
  id: string;
  name: string;
  collection: string;
  schema: string;
  owner: string;
  type: "atomicasset" | "simpleasset";
  template?: string; // only for atomic assets
  data: any;
}

export async function findAsset(
  assetId: string
): Promise<StakeableAsset | undefined> {
  if (!assetId) {
    return undefined;
  }
  const id = assetId.replace("#", "").trim();
  const aa = await findAtomicAsset(id);
  if (aa) {
    return {
      id: aa.asset_id.toString(),
      name: aa.name,
      collection: aa.collection.collection_name,
      schema: aa.schema.schema_name,
      owner: aa.owner,
      template: aa.template.template_id.toString(),
      type: "atomicasset",
      data: aa.data,
    };
  }
  const sa = await findSimpleAsset(id);
  if (sa) {
    return {
      id: sa.assetId,
      name: sa.mdata["name"],
      collection: sa.author,
      schema: sa.category,
      owner: sa.owner,
      type: "simpleasset",
      data: { ...sa.mdata, ...sa.idata },
    };
  }
  return undefined;
}

async function findAtomicAsset(
  assetId: string
): Promise<ListingAsset | undefined> {
  try {
    return await atomicMarket().getAsset(assetId);
  } catch (err) {
    console.error(`Error fetching atomic asset {}`, assetId, err);
  }
  return undefined;
}

async function findSimpleAsset(
  assetId: string
): Promise<SimpleAsset | undefined> {
  try {
    return fetchSimpleAsset(assetId);
  } catch (err) {
    console.error(`Error fetching simple asset {}`, assetId, err);
    return undefined;
  }
}

export function getImageURL(asset: StakeableAsset, imgField: string): string {
  const img = asset.data[imgField] as string;
  if (img && img.startsWith("http")) {
    return img;
  } else {
    return `https://ipfs.io/ipfs/${img}`;
  }
}

export async function calculateRPlanetAssetYield(
  asset: StakeableAsset,
  schemaRarityConf: RarityConfig,
  rateMods: Map<number, RateMod>
): Promise<number> {
  const schema = asset.schema;
  const rarityConf = findAssetRarity(
    asset,
    RPLANET_COLLECTION,
    schema,
    schemaRarityConf
  );
  if (schema.startsWith("rigs")) {
    return rarityConf.one_asset_value / 10000;
  } else if (schema.startsWith("elements")) {
    const template = asset.template as any;
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
  asset: StakeableAsset,
  schemaRarityConf: RarityConfig,
  pools: Map<string, PoolConfig>
): Promise<{
  assetYield: number;
  otherRaritiesYield: RarityYield[];
}> {
  const collection = asset.collection;
  const schema = asset.schema;
  const pool = pools.get(asset.collection);
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
  asset: StakeableAsset,
  rarities: RarityConfig[]
): RarityConfig {
  const collection = asset.collection;
  const schema = asset.schema;
  const schemaRarityConf = rarities.find((rar) => {
    if (rar.contract === "simpleassets") {
      return rar.author === collection && rar.schema === schema;
    } else {
      return rar.collection === collection && rar.schema === schema;
    }
  });
  if (!schemaRarityConf) {
    throw `Schema [${schema}] was not found in [${collection}] collection configuration for RPlanet :(`;
  }
  return schemaRarityConf;
}

function findAssetRarity(
  asset: StakeableAsset,
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
