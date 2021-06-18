<script lang="ts">
  import FormattedPrice from "../FormattedPrice.svelte";
  export let labels: Array<string> = [];
  export let hourlyValues: Array<number> = [0];

  interface IRow {
    label: string;
    values: Array<number>;
  }

  let rows: Array<IRow> = [];

  $: {
    rows = [
      { label: "hourly", values: hourlyValues },
      { label: "daily", values: hourlyValues.map((v) => v * 24) },
      { label: "weekly", values: hourlyValues.map((v) => v * 24 * 7) },
      { label: "montly", values: hourlyValues.map((v) => v * 24 * 30) },
      { label: "yearly", values: hourlyValues.map((v) => v * 24 * 365) },
    ];
  }
</script>

<table
  class="table is-bordered is-striped is-narrow is-fullwidth has-text-centered"
>
  <tr>
    <th>Period</th>
    {#each labels as label}
      <th>{label}</th>
    {/each}
  </tr>

  {#each rows as row}
    <tr>
      <td>{row.label}</td>
      {#each row.values as value}
        <td class="has-text-right">
          <FormattedPrice {value} />
        </td>
      {/each}
    </tr>
  {/each}
</table>
