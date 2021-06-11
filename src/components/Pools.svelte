<script lang="ts">
  import type {
    RarityYield,
    PoolConfig,
    RarityConfig,
  } from "../domain/asset-staking";
  import {
    raritiesYieldForSchema,
    RPLANET_COLLECTION,
  } from "../domain/asset-staking";
  import { format } from "../domain/currencies";
  import {
    poolsStakingConfigStore,
    rarityConfigStore,
  } from "../domain/rplanet";

  $: configs = load($poolsStakingConfigStore, $rarityConfigStore);

  function load(
    pools: Map<string, PoolConfig>,
    schemasRarityConf: RarityConfig[]
  ): Map<PoolConfig, { schema: string; rarities: RarityYield[] }[]> {
    const schemas = schemasRarityConf.filter(
      (sch) => sch.collection !== RPLANET_COLLECTION
    );
    const configs = new Map<
      PoolConfig,
      { schema: string; rarities: RarityYield[] }[]
    >();
    for (let schema of schemas) {
      const pool = pools.get(schema.collection);
      if (pool) {
        if (!configs.has(pool)) {
          configs.set(pool, []);
        }
        const poolConf = configs.get(pool);
        poolConf?.push({
          schema: schema.schema,
          rarities: raritiesYieldForSchema(schema, pool),
        });
      }
    }
    return configs;
  }
</script>

<div class="section">
  <p class="title is-4">RPlanet Pools</p>
  <!-- each collection - show name and pool size -->
  <!-- each schema - show name -->
  <!-- each rarity - show name and yield -->

  {#each [...configs] as [pool, schemas]}
    <p class="title is-5">
      {pool.id} <span class="tag is-info">{pool.fraction}</span>
    </p>
    {#each schemas as schema}
      <p class="subtitle is-6">{schema.schema}</p>
      <div class="tile">
        {#each schema.rarities as rarity}
          <div class="box m-2" class:crossed-out={rarity.aetherYield <= 0}>
            <p><strong>{rarity.rarity}</strong></p>
            <p>{format(rarity.aetherYield)} Aether / hour</p>
          </div>
        {/each}
      </div>
    {/each}
  {/each}
</div>
