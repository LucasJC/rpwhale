<script lang="ts">
  import { format } from "./format";
  import { getCurrencyBalance } from "./integration";
  import { account, aetherPrice, caponPrice, eneftPrice, waxonPrice, waxPrice, wecanPrice } from "./store";

  let balances: Array<{ currency: string, amount: number }>;

  $: if ($account && $account !== "") {
    balances = undefined;
    getCurrencyBalance($account).then(
      (result) => balances = result.map(rs => { 
        const split = rs.split(" ");
        return {
          currency: split[1],
          amount: Number.parseFloat(split[0])
        };
      })
    );
  }

  function convertToWax(currency: string, amount: number): number {
    const cur = currency.toLowerCase();
    let price = 0.0;
    switch(currency.toUpperCase()) {
      case"AETHER":
        price = $aetherPrice;
        break;
      case "CAPON":
        price = $caponPrice;
        break;
      case "ENEFT":
        price = $eneftPrice;
        break;
      case "WAXON":
        price = $waxonPrice;
        break;
      case "WECAN":
        price = $wecanPrice;
        break;
    }
    return amount * price;
  }

  function convertToUSD(currency: string, amount: number): number {
    return convertToWax(currency, amount) * $waxPrice;
  }

  function totalInWax(): number {
    if (!balances) {
      return 0.0;
    }
    return balances.map((b) => convertToWax(b.currency, b.amount)).reduce((prev, cur) => prev + cur);
  }

  function totalInUSD(): number {
    if (!balances) {
      return 0.0;
    }
    return balances.map((b) => convertToUSD(b.currency, b.amount)).reduce((prev, cur) => prev + cur);
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
            <td>{format(convertToWax(b.currency, b.amount))}</td>
            <td>{format(convertToUSD(b.currency, b.amount))}</td>
          </tr>
        {/each}
        <tr class="has-text-weight-bold has-background-info-light">
          <td>Total</td>
          <td> - </td>
          <td>{format(totalInWax())}</td>
          <td>{format(totalInUSD())}</td>
        </tr>
      </table>
    {/if}
  </div>
</main>
