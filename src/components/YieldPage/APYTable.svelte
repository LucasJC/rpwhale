<script lang="ts">
  import { rplanetPrices, waxPrice } from "../../domain/currencies";
  import { APY } from "../../domain/apy";

  export let apy: APY;

  interface IRow {
    label: string;
    value: string | undefined;
  }

  let rows: Array<IRow> = [];

  $: {
    rows = [
      { label: "Hourly", value: apy?.hpyFormatted() },
      { label: "Daily", value: apy?.dpyFormatted() },
      { label: "Weekly", value: apy?.wpyFormatted() },
      { label: "Monthly", value: apy?.mpyFormatted() },
      { label: "Yearly (APY)", value: apy?.apyFormatted() },
    ];
  }
</script>

<table class="table">
  <tbody>
    {#each rows as row}
      <tr>
        <th>{row.label}</th>
        <th>{row.value}</th>
      </tr>
    {/each}
  </tbody>
</table>
