<script lang="ts">
  import { format } from "../domain/format";
  import { waxPrice, pricesInWax, currencyBalance } from "../domain/store";
  import * as Balance from "../domain/Balance";

  let balances: Array<Balance.CalculatedBalance> = [];
  let totalWax: number = 0;
  let totalUSD: number = 0;

  $: {
    balances = Balance.calcPrices($currencyBalance, $pricesInWax, $waxPrice);
    const total = Balance.getTotals(balances);
    totalWax = total.wax;
    totalUSD = total.usd;
  }
</script>

<main>
  <div class="section">
    {#if balances.length > 0}
      <p class="subtitle">Account holdings:</p>
      <table
        class="table is-bordered is-striped is-narrow is-fullwidth has-text-centered"
      >
        <tr>
          <th>Currency</th>
          <th>Amount</th>
          <th>Amount in Wax</th>
          <th>Amount in USD</th>
        </tr>
        {#each balances as b}
          <tr>
            <td>{b.currency}</td>
            <td class="has-text-right">{format(b.amount)}</td>
            <td class="has-text-right">{format(b.waxAmount)}</td>
            <td class="has-text-right">{format(b.usdAmount)}</td>
          </tr>
        {/each}
        <tr
          class="has-text-weight-bold has-background-info-light has-text-info-dark"
        >
          <td>Total</td>
          <td> - </td>
          <td class="has-text-right">{format(totalWax)}</td>
          <td class="has-text-right">{format(totalUSD)}</td>
        </tr>
      </table>
    {/if}
  </div>
</main>
