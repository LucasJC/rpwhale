<script lang="ts">
  import type {
    RarityYield,
    PoolConfig,
    RarityConfig,
  } from "../domain/asset-staking";
  import {
    RARITY_SEARCH_KEY,
    SCHEMA_SEARCH_KEY,
    COLLECTION_SEARCH_KEY,
  } from "../domain/asset-staking";
  import {
    raritiesYieldForSchema,
    RPLANET_COLLECTION,
  } from "../domain/asset-staking";
  import { format } from "../domain/currencies";
  import { clearSearch, updateSearch } from "../domain/history";
  import {
    poolsStakingConfigStore,
    rarityConfigStore,
  } from "../domain/rplanet";
  import GoUpButton from "./GoUpButton.svelte";

  export let collectionFilter: string | undefined;
  export let schemaFilter: string | undefined;
  export let rarityFilter: string | undefined;

  $: configs = load(
    $poolsStakingConfigStore,
    $rarityConfigStore,
    collectionFilter,
    schemaFilter,
    rarityFilter
  );

  function updateSearchFromFilters() {
    updateSearch(RARITY_SEARCH_KEY, rarityFilter);
    updateSearch(SCHEMA_SEARCH_KEY, schemaFilter);
    updateSearch(COLLECTION_SEARCH_KEY, collectionFilter);
  }

  function load(
    pools: Map<string, PoolConfig>,
    schemasRarityConf: RarityConfig[],
    collectionFilter?: string,
    schemaFilter?: string,
    rarityFilter?: string
  ): Map<PoolConfig, { schema: string; rarities: RarityYield[] }[]> {
    let schemas = schemasRarityConf.filter(
      (sch) => sch.collection !== RPLANET_COLLECTION
    );

    updateSearchFromFilters();

    if (collectionFilter) {
      schemas = schemas.filter(
        (sch) =>
          sch.collection.includes(collectionFilter.toLowerCase()) ||
          sch.author.includes(collectionFilter.toLowerCase())
      );
    }

    if (schemaFilter) {
      schemas = schemas.filter((sch) =>
        sch.schema.includes(schemaFilter.toLowerCase())
      );
    }

    const configs = new Map<
      PoolConfig,
      { schema: string; rarities: RarityYield[] }[]
    >();
    for (let schema of schemas) {
      let pool = pools.get(schema.collection);
      if (!pool) {
        // try for simple assets
        pool = pools.get(schema.author);
      }
      if (pool) {
        const rarities = raritiesYieldForSchema(schema, pool).filter((rar) => {
          if (rarityFilter) {
            return rar.rarity
              .toLowerCase()
              .includes(rarityFilter.toLowerCase());
          }
          return true;
        });
        if (rarities.length > 0) {
          if (!configs.has(pool)) {
            configs.set(pool, []);
          }
          const poolConf = configs.get(pool);
          poolConf?.push({
            schema: schema.schema,
            rarities,
          });
        }
      }
    }
    return configs;
  }

  function clearFilters() {
    collectionFilter = undefined;
    schemaFilter = undefined;
    rarityFilter = undefined;
    clearSearch();
  }
</script>

<GoUpButton />

<div class="section">
  <p class="title is-4">RPlanet Pools Explorer</p>
  <p>
    Here you will find every collection pool and its different rarities. <br />
    Remember that aether yield for every rarity depends on the amount of NFTs staked.
  </p>

  <div class="form mt-6">
    <div class="field is-grouped is-grouped-multiline">
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Collection"
          bind:value={collectionFilter}
        />
      </div>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Schema"
          bind:value={schemaFilter}
        />
      </div>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Rarity"
          bind:value={rarityFilter}
        />
      </div>
      <div class="cotrol">
        <button class="button is-info" on:click={clearFilters}>Clear</button>
      </div>
    </div>
  </div>

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
