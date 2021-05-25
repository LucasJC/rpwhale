<script lang="ts">
  import { format } from "../format";
  import { pricesInWax, waxPrice } from "../store";
  import * as Price from "../domain/Price";
  import Table from "./PeriodicIncomeTable.svelte";

  let aetherPrice: number = 0;
  $: aetherPrice = Price.getPrice($pricesInWax, "AETHER");

  export let landsYield: Array<{ id: string; value: number }> = [];

  let rows: Array<{
    id: string;
    value: number;
    wax: number;
    aeth: number;
    usd: number;
  }> = [];

  $: rows = landsYield.map(({ id, value }) => {
    const priceInWax = Price.getPrice($pricesInWax, id);
    const wax = value * priceInWax;
    const aeth = wax / aetherPrice;
    const usd = wax * $waxPrice;

    return {
      id,
      value,
      wax,
      aeth,
      usd,
    };
  });

  let totalWax: number = 0;
  $: totalWax = rows.reduce((total, { wax }) => total + wax, 0);

  let totalAeth: number = 0;
  $: totalAeth = rows.reduce((total, { aeth }) => total + aeth, 0);

  let totalUSD: number = 0;
  $: totalUSD = rows.reduce((total, { usd }) => total + usd, 0);

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
