<script lang="ts">
  import { APY } from "../../domain/apy";

  export let apy: APY;

  interface IRow {
    label: string;
    val1: string | undefined;
    val2: string | undefined;
  }

  let rows: Array<IRow> = [];

  $: {
    const mpy = APY.getBoundedMpy(apy);
    const compYearlyApy = (1 + mpy) ** 12;
    rows = [
      { label: "Hourly", val1: apy?.hpyFormatted(), val2: apy?.hpyFormatted() },
      { label: "Daily", val1: apy?.dpyFormatted(), val2: apy?.dpyFormatted() },
      { label: "Weekly", val1: apy?.wpyFormatted(), val2: apy?.wpyFormatted() },
      {
        label: "Monthly",
        val1: apy?.mpyFormatted(),
        val2: apy?.mpyFormatted(),
      },
      {
        label: "Yearly (APY)",
        val1: apy?.apyFormatted(),
        val2: APY.toPercentage(compYearlyApy),
      },
    ];
  }
</script>

<table class="table">
  <thead>
    <tr>
      <th />
      <th>No Compounding</th>
      <th>Compounding Monthly</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <td>{row.label}</td>
        <td>{row.val1}</td>
        <td>{row.val2}</td>
      </tr>
    {/each}
  </tbody>
</table>
