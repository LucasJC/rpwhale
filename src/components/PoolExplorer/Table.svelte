<script lang="ts">
  import FormattedPrice from "../FormattedPrice.svelte";
  import type { IPool } from "./types";

  export let data: Array<IPool> = [];
</script>

<div class="table-container">
  <table class="table is-striped is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>Pool</th>
        <th>A/hr</th>
        <th>Shares Staked</th>
        <th>Schema</th>
        <th>Rarity</th>
        <th>A/hr</th>
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        {#each row.schemas as schema}
          {#each schema.rarities as rarity}
            <tr>
              <td>{row.poolConfig.id}</td>
              <td>
                <FormattedPrice
                  value={Number(row.poolConfig.fraction.split(" ")[0])}
                />
              </td>
              <td>
                <FormattedPrice value={Number(row.poolConfig.staked)} />
              </td>
              <td>
                {schema.schema.schema}
              </td>
              <td class="pools__rarity" title={rarity.rarity}>
                {rarity.rarity}
              </td>
              <td>
                <FormattedPrice value={rarity.aetherYield} />
              </td>
            </tr>
          {/each}
        {/each}
      {/each}
    </tbody>
  </table>
</div>

<style>
  .pools__rarity {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
