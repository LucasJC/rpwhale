<script lang="ts">
  import { format } from "./format";
  import { getCurrencyBalance } from "./integration";
  import {
    account,
    aetherPrice,
    caponPrice,
    eneftPrice,
    waxonPrice,
    waxPrice,
    wecanPrice,
  } from "./store";
  import type { CalculatedBalance } from "./types";

  let balances: Array<CalculatedBalance> = [];
  let totalWax: number = 0.0;
  let totalUSD: number = 0.0;

  $: if (
    $account &&
    $account !== "" &&
    $aetherPrice &&
    $caponPrice &&
    $eneftPrice &&
    $waxonPrice &&
    $wecanPrice &&
    $waxPrice
  ) {
    balances = [];
    getBalances().then((b) => {
      balances = updateBalances(b);
    });
  }

  async function getBalances(): Promise<Array<CalculatedBalance>> {
    const res = await getCurrencyBalance($account);
    if (!res) {
      return [];
    }
    return res.map((rs) => {
      const split = rs.split(" ");
      return {
        currency: split[1],
        amount: Number.parseFloat(split[0]),
      };
    });
  }

  function updateBalances(
    balances: Array<CalculatedBalance>
  ): Array<CalculatedBalance> {
    totalWax = 0;
    totalUSD = 0;
    return balances.map((blc) => {
      const price = getPrice(blc.currency);
      const waxAmount = blc.amount * price;
      const usdAmount = (blc.waxAmount || 0) * $waxPrice;
      totalWax += waxAmount;
      totalUSD += usdAmount;

      return {
        ...blc,
        waxAmount,
        usdAmount,
      };
    });
  }

  function getPrice(currency: string): number {
    console.log("Getting price for " + currency);
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
    console.log("returning 0");
    return 0.0;
  }
</script>

<main>
  <div class="section">
    {#if balances.length > 0}
      <p class="subtitle">Account holdings:</p>
      <table
        class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
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
            <td>{format(b.amount)}</td>
            <td>{format(b.waxAmount || 0)}</td>
            <td>{format(b.usdAmount || 0)}</td>
          </tr>
        {/each}
        <tr
          class="has-text-weight-bold has-background-info-light has-text-info-dark"
        >
          <td>Total</td>
          <td> - </td>
          <td>{format(totalWax)}</td>
          <td>{format(totalUSD)}</td>
        </tr>
      </table>
    {/if}
  </div>
</main>
