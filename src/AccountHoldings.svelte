<script lang="ts">
  import { format } from "./format";
  import { getCurrencyBalance, getTableRows } from "./integration";
  import { account } from "./store";

  let balances: Map<string, number>;
  $: if ($account && $account !== "") {
   getCurrencyBalance($account).then(result => balances = new Map(result.map(rs => {
     const split = rs.split(" ");
     return [split[1], Number.parseFloat(split[0])];
   })));
  }
</script>

<main>
  <div class="section">
    {#if balances}
      <p class="subtitle">Account holdings:</p>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <tr>
          <th>Currency</th>
          <th>Amount</th>
        </tr>
        {#each [...balances] as [currency, amount]}
        <tr>
          <td>{currency}</td>
          <td>{format(amount)}</td>
        </tr>
        {/each}
      </table>
    {/if}
  </div>
</main>