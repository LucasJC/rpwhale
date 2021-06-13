<script lang="ts">
  import type { ListingAsset } from "../../domain/asset-staking";
  import { format, rplanetPrices, waxPrice } from "../../domain/currencies";
  import * as Land from "../../domain/land";
  import Table from "./PeriodicIncomeTable.svelte";

  export let lands: Array<ListingAsset> = [];

  let landsYield: Array<Land.ILandYield>;
  $: landsYield = Land.getLandsYield(lands);

  let rows: Array<Land.ILandYieldPrices> = [];
  $: rows = Land.getLandsYieldPrices(landsYield, $rplanetPrices, $waxPrice);

  let totalWax: number = 0;
  let totalAeth: number = 0;
  let totalUSD: number = 0;

  $: {
    const { wax, aeth, usd } = Land.aggregateLandYields(rows);
    totalWax = wax;
    totalAeth = aeth;
    totalUSD = usd;
  }

  let tables: Array<{ label: string; mp: number }>;
  $: tables = [
    { label: "Aether", mp: totalAeth },
    { label: "Wax", mp: totalWax },
    { label: "USD", mp: totalUSD },
  ];
</script>

<div class="columns">
  <div class="column">
    <p class="subtitle has-text-centered">Hourly Yield</p>
    <table class="table is-bordered is-narrow is-fullwidth has-text-centered">
      <tr>
        <th>Mineral</th>
        <th>Amount</th>
      </tr>
      {#each rows as row}
        <tr>
          <td class="is-capitalized">{row.id.toLowerCase()}</td>
          <td class="has-text-right">{format(row.value)}</td>
        </tr>
      {/each}
    </table>
  </div>
  {#each tables as table}
    <div class="column">
      <p class="subtitle has-text-centered">
        {table.label}
      </p>
      <Table hourlyAmount={table.mp} />
    </div>
  {/each}
</div>
