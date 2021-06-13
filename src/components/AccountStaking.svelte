<script lang="ts">
  import type { AccountCollectionStaking } from "../dal/rplanet";
  import { poolsStakingConfigStore } from "../domain/rplanet";
  import {
    accountStakingConfigStore,
    calcMiningPower,
    calcTotals,
  } from "../domain/account-staking";
  import { format } from "../domain/currencies";

  let collectionsStaking: AccountCollectionStaking[] = [];
  let totalPower = 0.0;
  let totalCollected = 0.0;

  $: {
    collectionsStaking = calcMiningPower(
      $accountStakingConfigStore,
      $poolsStakingConfigStore
    );
    const { miningPower, collected } = calcTotals(collectionsStaking);
    totalPower = miningPower;
    totalCollected = collected;
  }
</script>

<div class="section">
  <p class="title is-4">Staked Collections</p>
  {#if collectionsStaking && collectionsStaking.length > 0}
    <table
      class="table is-bordered is-narrow is-fullwidth has-text-centered is-hcentered"
    >
      <tr>
        <th>Collection</th>
        <th>Collected Aether</th>
        <th>Staking Power</th>
      </tr>
      {#each collectionsStaking as cs}
        <tr>
          <td>{cs.collection}</td>
          <td class="has-text-right"
            >{format(Number.parseFloat(cs.collected.split(" ")[0]))}</td
          >
          <td class="has-text-right">{format(cs?.miningPower)}</td>
        </tr>
      {/each}
      <tr
        class="has-text-weight-bold has-background-info-light has-text-info-dark"
      >
        <td>Total</td>
        <td class="has-text-right">{format(totalCollected)}</td>
        <td class="has-text-right">{format(totalPower)}</td>
      </tr>
    </table>
  {:else}
    <p>No staked assets found for this account.</p>
  {/if}
</div>
