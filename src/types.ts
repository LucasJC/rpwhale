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
  }
}

export class AlcorPrice {
  last_price: number;
}

export enum ALCOR_MARKET {
  AETHER = 29,
  WECAN = 41,
  CAPON = 43,
  ENEFT = 45,
  WAXON = 42
}