<script lang="ts">
  import { format } from "../format";
  import {
    aetherPrice,
    caponPrice,
    eneftPrice,
    waxonPrice,
    waxPrice,
    wecanPrice,
  } from "../store";

  function getPrice(currency: string): number {
    const cur = currency.toUpperCase();
    if ("AETHER" == cur) {
      return $aetherPrice;
    }
    if ("CAPON" == cur) {
      return $caponPrice;
    }
    if ("ENEFT" == cur) {
      return $eneftPrice;
    }
    if ("WAXON" == cur) {
      return $waxonPrice;
    }
    if ("WECAN" == cur) {
      return $wecanPrice;
    }
    return 0;
  }

  export let landsYield: Array<{ id: string; value: number }> = [];

  let rows: Array<{ id: string; value: number; wax: number; usd: number }> = [];

  $: rows = landsYield.map(({ id, value }) => {
    const priceInWax = getPrice(id);
    const wax = value * priceInWax;
    const usd = wax * $waxPrice;

    return {
      id,
      value,
      wax,
      usd,
    };
  });

  let totalWax: number = 0;
  $: totalWax = rows.reduce((total, { wax }) => total + wax, 0);

  let totalUSD: number = 0;
  $: totalUSD = rows.reduce((total, { usd }) => total + usd, 0);
</script>

<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
  <tr>
    <th>Currency</th>
    <th>Amount</th>
    <th>Amount in Wax</th>
    <th>Amount in USD</th>
  </tr>
  {#each rows as row}
    <tr>
      <td>{row.id}</td>
      <td>{format(row.value)}</td>
      <td>{format(row.wax)}</td>
      <td>{format(row.usd)}</td>
    </tr>
  {/each}
  <tr class="has-text-weight-bold has-background-info-light has-text-info-dark">
    <td>Total</td>
    <td> - </td>
    <td>{format(totalWax)}</td>
    <td>{format(totalUSD)}</td>
  </tr>
</table>
