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
  import GoUpButton from "./GoUpButton.svelte";

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

<GoUpButton />

<div class="section">
  <p class="title is-4">RPlanet Pools Explorer</p>
  <p>
    Here you will find every collection pool and its different rarities. <br />
    Remember that aether yield for every rarity depends on the amount of NFTs staked.
  </p>
  {#each [...configs] as [pool, schemas]}
    <div class="section">
      <div class="level">
        <div class="level-left">
          <p class="is-size-5 mt-4 mb-2">
            Pool: <strong class="is-capitalized">{pool.id}</strong>
          </p>
        </div>
        <div class="level-right">
          <span class="ml-2 tag is-danger is-medium"
            >{format(Number.parseFloat(pool.fraction.split(" ")[0]))} Aether/hour</span
          >
          <span class="ml-2 tag is-medium"
            >{format(pool.staked)} Shares Staked</span
          >
        </div>
      </div>
      <div class="box">
        {#each schemas as schema, i}
          <p class="is-size-5 mt-4 mb-2 has-text-centered">
            Schema: <strong class="is-capitalized">{schema.schema}</strong>
          </p>
          <div>
            <table
              class="table is-narrow is-bordered has-text-centered is-hcentered"
            >
              {#if i == 0}
                <tr>
                  <th>Rarity</th>
                  <th class="has-text-right">Aether Yield</th>
                </tr>
              {/if}
              {#each schema.rarities as rarity}
                <tr>
                  <td
                    class="is-italic break"
                    class:crossed-out={rarity.aetherYield <= 0}
                    >{rarity.rarity}</td
                  >
                  <td
                    class="has-text-right"
                    class:crossed-out={rarity.aetherYield <= 0}
                    ><strong>{format(rarity.aetherYield)} A/hr</strong></td
                  >
                </tr>
              {/each}
            </table>
          </div>
          <hr />
        {/each}
      </div>
    </div>
  {/each}
</div>
