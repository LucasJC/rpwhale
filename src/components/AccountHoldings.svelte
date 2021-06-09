<script lang="ts">
  import { format, rplanetPrices, waxPrice } from "../domain/currencies";
  import { currencyBalance } from "../domain/balance";
  import * as Balance from "../domain/balance";

  let balances: Array<Balance.CalculatedBalance> = [];
  let totalWax: number = 0;
  let totalUSD: number = 0;

  $: {
    const accountBalance = Balance.getAccountBalances(
      $currencyBalance,
      $rplanetPrices,
      $waxPrice
    );
    balances = accountBalance.balances;
    totalWax = accountBalance.wax;
    totalUSD = accountBalance.usd;
  }
</script>

<main>
  <div class="section">
    {#if balances.length > 0}
      <p class="subtitle">Account holdings:</p>
      <table class="table is-bordered is-narrow is-fullwidth has-text-centered">
        <tr>
          <th>Currency</th>
          <th>Amount</th>
          <th>Amount in Wax</th>
          <th>Amount in USD</th>
        </tr>
        {#each balances as b}
          <tr>
            <td>
              <div
                class="image is-24x24 is-hcentered has-tooltip-right"
                data-tooltip={b.currency}
              >
                <img
                  src="image/{b.currency.toLowerCase()}.png"
                  alt={b.currency}
                />
              </div>
            </td>
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
