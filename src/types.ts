export class PoolConfig {
  id: string;
  staked: number;
  pending_staked: number;
  stock: string;
  fraction: string;
  enabled: number;
}

export class AccountCollectionStaking {
  collection: string;
  user: string;
  staked: number;
  collected: string;
  miningPower?: number;
}

export class WaxPrice {
  wax: {
    usd: number;
  };
}

export class AlcorPrice {
  last_price: number;
}

export enum ALCOR_MARKET {
  AETHER = 29,
  WECAN = 41,
  CAPON = 43,
  ENEFT = 45,
  WAXON = 42,
}

export class CalculatedBalance {
  currency: string;
  amount: number;
  waxAmount?: number = 0;
  usdAmount?: number = 0;
}
export class AtomicAsset {
  asset_id: string;
  collection_name: string;
  schema_name: string;
  template_id: number;
  ram_payer: string;
  immutable_serialized_data: number[];
  mutable_serialized_data: number[];
}
