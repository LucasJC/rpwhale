<script lang="ts">
  import * as Staking from "../domain/Staking";
  import * as Balance from "../domain/Balance";
  import { format } from "../domain/format";
  import {
    account,
    aetherPrice,
    currencyBalance,
    landsIncome,
    miningPower,
    pricesInWax,
    waxPrice,
  } from "../domain/store";
  import type { IPricesInWax } from "../domain/store";

  $: rank = Staking.getRank($miningPower);

  $: monthlyIncome = calculateMonthlyIncome(
    $miningPower,
    $aetherPrice,
    $waxPrice,
    $landsIncome
  );

  $: currentHoldings = calculateCurrentHoldings(
    $currencyBalance,
    $pricesInWax,
    $waxPrice
  );

  function calculateMonthlyIncome(
    miningPower: number,
    aetherPrice: number,
    waxPrice: number,
    landsIncome: number
  ) {
    return 24 * 30 * (landsIncome + miningPower * aetherPrice * waxPrice);
  }

  // TODO remove this logic that is repeated in AccountHoldings.svelte
  function calculateCurrentHoldings(
    currencyBalance: Balance.CalculatedBalance[],
    pricesInWax: IPricesInWax,
    waxPrice: number
  ) {
    const balances = Balance.calcPrices(currencyBalance, pricesInWax, waxPrice);
    const total = Balance.getTotals(balances);
    return total.usd;
  }
</script>

<main>
  <nav class="section level has-text-center">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Account</p>
        <p class="title is-2">{$account}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Rank</p>
        <p class="title is-1">{rank}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Staking Power</p>
        <p class="title is-2">{format($miningPower)} A/h</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Monthly Income</p>
        <p class="title is-3">{format(monthlyIncome)} USD</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Current Holdings</p>
        <p class="title is-3">{format(currentHoldings)} USD</p>
      </div>
    </div>
  </nav>
</main>
