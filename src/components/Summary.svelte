<script lang="ts">
  import * as Staking from "../domain/Staking";
  import * as Balance from "../domain/Balance";
  import { format } from "../domain/format";
  import {
    account,
    aetherPrice,
    landsIncome,
    miningPowerStore,
    pricesInWax,
    waxPrice,
  } from "../domain/store";
  import { currencyBalance } from "../domain/Balance";

  $: rank = Staking.getRank($miningPowerStore);

  $: monthlyIncome =
    24 * 30 * ($landsIncome + $miningPowerStore * $aetherPrice * $waxPrice);

  $: currentHoldings = Balance.getAccountBalances(
    $currencyBalance,
    $pricesInWax,
    $waxPrice
  ).usd;
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
      <div
        class="has-tooltip-bottom has-tooltip-info"
        data-tooltip="You are a {rank.name}"
      >
        <p class="heading">Rank</p>
        <p class="title is-1">{rank.emoji}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Staking Power</p>
        <p class="title is-2">{format($miningPowerStore)} A/h</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div
        class="has-tooltip-bottom has-tooltip-info"
        data-tooltip="Staking and land passive income in USD"
      >
        <p class="heading">Monthly Income</p>
        <p class="title is-3">{format(monthlyIncome)} USD</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div
        class="has-tooltip-bottom has-tooltip-info"
        data-tooltip="We only consider Aether + Minerls in USD"
      >
        <p class="heading">Current RPlanet Holdings</p>
        <p class="title is-3">{format(currentHoldings)} USD</p>
      </div>
    </div>
  </nav>
</main>
