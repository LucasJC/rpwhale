import type {
  RarityYield,
  PoolConfig,
  RarityConfig,
} from "../../domain/asset-staking";

export interface IPool {
  poolConfig: PoolConfig;
  schemas: Array<ISchemaConfig>;
}

export interface ISchemaConfig {
  schema: RarityConfig;
  rarities: RarityYield[];
}
