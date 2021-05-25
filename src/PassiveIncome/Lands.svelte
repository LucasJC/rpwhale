<script lang="ts">
  import { format } from "../format";
  import { pricesInWax, waxPrice } from "../store";
  import * as Asset from "../domain/Asset";
  import Table from "./PeriodicIncomeTable.svelte";
  import type { ListingAsset } from "../dal/am";

  export let lands: Array<ListingAsset> = [];

  let landsYield: Array<Asset.ILandYield>;
  $: landsYield = Asset.getLandsYield(lands);

  let rows: Array<Asset.ILandYieldPrices> = [];
  $: rows = Asset.getLandsYieldPrices(landsYield, $pricesInWax, $waxPrice);

  let totalWax: number = 0;
  let totalAeth: number = 0;
  let totalUSD: number = 0;

  $: {
    const { wax, aeth, usd } = Asset.aggregateLandYields(rows);
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

<div>
  <div class="columns">
    <div class="column">
      <p class="subtitle has-text-centered">Hourly Yield</p>
      <table
        class="table is-bordered is-striped is-narrow is-fullwidth has-text-centered"
      >
        <tr>
          <th>Mineral</th>
          <th>Amount</th>
        </tr>
        {#each rows as row}
          <tr>
            <td>{row.id}</td>
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
</div>
