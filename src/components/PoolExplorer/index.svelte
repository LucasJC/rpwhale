<script lang="ts">
  import type {
    RarityYield,
    PoolConfig,
    RarityConfig,
  } from "../../domain/asset-staking";
  import {
    raritiesYieldForSchema,
    RPLANET_COLLECTION,
  } from "../../domain/asset-staking";
  import { clearSearch, setPoolFilters } from "../../domain/history";
  import type { IPoolFilters } from "../../domain/history";
  import { defaultPoolFilters } from "../../domain/history";
  import {
    poolsStakingConfigStore,
    rarityConfigStore,
  } from "../../domain/rplanet";
  import GoUpButton from "../GoUpButton.svelte";
  import Table from "../PoolExplorer/Table.svelte";
  import type { IPool, ISchemaConfig } from "./types";

  export let filters: IPoolFilters = defaultPoolFilters;

  let tableData: Array<IPool> = [];
  let filteredTableData: Array<IPool> = [];
  let totalCount: number = 0;
  let filteredCount: number = 0;

  $: {
    tableData = calcTableData($poolsStakingConfigStore, $rarityConfigStore);
    filteredTableData = filterTableData(tableData, filters);

    totalCount = tableData.flatMap((pool) =>
      pool.schemas.flatMap((schema) => schema.rarities)
    ).length;
    filteredCount = filteredTableData.flatMap((pool) =>
      pool.schemas.flatMap((schema) => schema.rarities)
    ).length;
  }

  function clearFilters() {
    clearSearch();
  }

  function handleChange(e: Event): void {
    const name = (e.target as any)?.name;
    const value = (e.target as any)?.value || "";
    setPoolFilters({ [name]: value });
  }

  function filterByCollection(
    filters: IPoolFilters
  ): (s: ISchemaConfig) => boolean {
    return ({ schema }) => {
      if (!filters.collection) {
        return true;
      }
      return (
        schema.collection.includes(filters.collection.toLowerCase()) ||
        schema.author.includes(filters.collection.toLowerCase())
      );
    };
  }

  function filterBySchema(
    filters: IPoolFilters
  ): (s: ISchemaConfig) => boolean {
    return ({ schema }) => {
      if (!filters.schema) {
        return true;
      }
      return schema.schema.includes(filters.schema.toLowerCase());
    };
  }

  function filterByRarity(filters: IPoolFilters): (r: RarityYield) => boolean {
    return ({ rarity }) => {
      if (!filters.rarity) {
        return true;
      }
      return rarity.toLowerCase().includes(filters.rarity.toLowerCase());
    };
  }

  function filterByYield(filters: IPoolFilters): (r: RarityYield) => boolean {
    return ({ aetherYield }) => {
      if (!filters.minYield) {
        return true;
      }
      return filters.minYield <= aetherYield;
    };
  }

  function filterTableData(
    data: Array<IPool>,
    filters: IPoolFilters
  ): Array<IPool> {
    return data.map((pool) => {
      const schemas = pool.schemas
        .filter(filterByCollection(filters))
        .filter(filterBySchema(filters))
        .map((schemaConfig) => ({
          ...schemaConfig,
          rarities: schemaConfig.rarities
            .filter(filterByRarity(filters))
            .filter(filterByYield(filters)),
        }));

      return {
        ...pool,
        schemas,
      };
    });
  }

  function calcTableData(
    pools: Map<string, PoolConfig>,
    schemasRarityConf: RarityConfig[]
  ): Array<IPool> {
    const schemas = schemasRarityConf.filter(
      (schema) => schema.collection !== RPLANET_COLLECTION
    );

    const rowMap = new Map<string, IPool>();

    for (const schema of schemas) {
      // try for simple assets
      const pool = pools.get(schema.collection) || pools.get(schema.author);
      if (!pool) {
        continue;
      }

      if (!rowMap.get(pool.id)) {
        rowMap.set(pool.id, {
          poolConfig: pool,
          schemas: [],
        });
      }

      rowMap.get(pool.id)?.schemas.push({
        schema,
        rarities: raritiesYieldForSchema(schema, pool),
      });
    }

    return [...rowMap.values()];
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
          name="collection"
          class="input"
          type="text"
          placeholder="Collection"
          value={filters.collection}
          on:keyup={handleChange}
          on:blur={handleChange}
          on:change={handleChange}
        />
      </div>
      <div class="control">
        <input
          name="schema"
          class="input"
          type="text"
          placeholder="Schema"
          value={filters.schema}
          on:keyup={handleChange}
          on:blur={handleChange}
          on:change={handleChange}
        />
      </div>
      <div class="control">
        <input
          name="rarity"
          class="input"
          type="text"
          placeholder="Rarity"
          value={filters.rarity}
          on:keyup={handleChange}
          on:blur={handleChange}
          on:change={handleChange}
        />
      </div>
      <div class="control">
        <input
          name="minYield"
          class="input"
          type="number"
          placeholder="Min. Aether/Hour Yield"
          value={filters.minYield}
          on:keyup={handleChange}
          on:blur={handleChange}
          on:change={handleChange}
        />
      </div>
      <div class="cotrol">
        <button class="button is-info" on:click={clearFilters}>Clear</button>
      </div>
    </div>
    <p>Showing {filteredCount} of {totalCount}</p>
  </div>

  <Table data={filteredTableData} />
</div>
