export class StakingConfig {
  id: string;
  contract: string;
  author: string;
  collection: string;
  schema: string;
  name_id: string;
  img_id: string;
  rarity_id: string;
  rarities: Rarity[]
  r1: number;
  r2: number;
  r3: number;
}

export class Rarity {
  rarity: string;
  uniq_assets: number;
  one_asset_value: number;
  collection_value: number;
  r1: number;
  r2: number;
}