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
        <th>Aether/hour</th>
        <th>Shares Staked</th>
        <th>Schema</th>
        <th>Rarity</th>
        <th>Aether/hour</th>
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
              <td>
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
