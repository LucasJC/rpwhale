<script lang="ts">
  import { format } from "./format";
  import { getCurrencyBalance } from "./integration";
  import { account, aetherPrice, caponPrice, eneftPrice, waxonPrice, waxPrice, wecanPrice } from "./store";
import type { CalculatedBalance } from "./types";

  let balances: Array<CalculatedBalance>;
  let totalWax: number = 0.0;
  let totalUSD: number = 0.0;

  $: if ($account && $account !== "" && $aetherPrice && $caponPrice && $eneftPrice && $waxonPrice && $wecanPrice && $waxPrice) {
    balances = undefined;
    getBalances().then(b => {
      balances = updateBalances(b);
    });
  }

  async function getBalances(): Promise<Array<CalculatedBalance>> {
    const res = await getCurrencyBalance($account);
    if (!res) {
      return [];
    }
    return res.map(rs => { 
        const split = rs.split(" ");
        return {
          currency: split[1],
          amount: Number.parseFloat(split[0])
        };
      });
  }

  function updateBalances(balances: Array<CalculatedBalance>): Array<CalculatedBalance> {
    totalWax = 0;
    totalUSD = 0;
    if (balances) {
      for(let blc of balances) {
        const price = getPrice(blc.currency);
        blc.waxAmount = blc.amount * price;
        blc.usdAmount = blc.waxAmount * $waxPrice;
        totalWax += blc.waxAmount;
        totalUSD += blc.usdAmount;
      }
    }
    return balances;
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
    {#if balances}
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
            <td>{format(b.waxAmount)}</td>
            <td>{format(b.usdAmount)}</td>
          </tr>
        {/each}
        <tr class="has-text-weight-bold has-background-info-light has-text-info-dark">
          <td>Total</td>
          <td> - </td>
          <td>{format(totalWax)}</td>
          <td>{format(totalUSD)}</td>
        </tr>
      </table>
    {/if}
  </div>
</main>
